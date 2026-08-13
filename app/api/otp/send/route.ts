import { NextResponse } from "next/server";
import { isEmail } from "@/lib/phone";
import { isConfigured, generateCode, issueToken, sendCodeEmail } from "@/lib/emailOtp";

/**
 * Start email verification — POST { email: string }.
 *
 * Generates a 6-digit code, emails it via Resend, and returns a stateless signed
 * token the client sends back on verify. The code lives only in the email; the
 * token carries an HMAC over (payload + code) so it can't be reversed.
 *
 * Graceful rollout: if RESEND_API_KEY isn't set yet, we return
 * { ok: true, configured: false } and the popup falls back to the email-only
 * instant-discount flow — so signups keep working before credentials land.
 */
export const dynamic = "force-dynamic";

// Best-effort per-instance throttle. Serverless spreads requests across
// instances so this isn't authoritative, but it cheaply blunts a burst.
const RECENT = new Map<string, number>();
const MIN_INTERVAL_MS = 30_000; // one send per email per 30s per instance

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  // Not configured → tell the client to fall back to email-only join.
  if (!isConfigured()) {
    return NextResponse.json({ ok: true, configured: false });
  }

  const now = Date.now();
  const last = RECENT.get(email);
  if (last && now - last < MIN_INTERVAL_MS) {
    return NextResponse.json({ ok: false, configured: true, error: "cooldown" }, { status: 429 });
  }

  const code = generateCode();
  const sent = await sendCodeEmail(email, code);
  if (!sent.ok) {
    console.error("[otp/send] Resend send failed:", sent.message);
    return NextResponse.json({ ok: false, configured: true, error: "send_failed" }, { status: 502 });
  }

  RECENT.set(email, now);
  if (RECENT.size > 5000) RECENT.clear();

  const token = issueToken(email, code);
  return NextResponse.json({ ok: true, configured: true, sent: true, token });
}
