import { NextResponse } from "next/server";
import { normalizeIsraeliPhone } from "@/lib/phone";
import { isConfigured, startVerification } from "@/lib/twilioVerify";

/**
 * Start phone verification — POST { phone: string }.
 *
 * Asks Twilio Verify to SMS a one-time code to the shopper's phone. Twilio owns
 * code generation, expiry, attempt caps and per-phone rate limiting, so there's
 * nothing to store here.
 *
 * Graceful rollout: if the Twilio env vars aren't set yet, we return
 * { ok: true, configured: false } and the popup falls back to the email-only
 * instant-discount flow — so signups keep working before credentials land.
 */
export const dynamic = "force-dynamic";

// Best-effort per-instance throttle. Serverless spreads requests across
// instances so this isn't authoritative — Twilio Verify's own rate limits are
// the real guard — but it cheaply blunts a burst hitting a single instance.
const RECENT = new Map<string, number>();
const MIN_INTERVAL_MS = 30_000; // one send per phone per 30s per instance

export async function POST(request: Request) {
  let body: { phone?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const raw = typeof body.phone === "string" ? body.phone : "";
  const phone = normalizeIsraeliPhone(raw);
  if (!phone) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }

  // Not configured → tell the client to fall back to email-only.
  if (!isConfigured()) {
    return NextResponse.json({ ok: true, configured: false });
  }

  const now = Date.now();
  const last = RECENT.get(phone);
  if (last && now - last < MIN_INTERVAL_MS) {
    return NextResponse.json({ ok: false, configured: true, error: "cooldown" }, { status: 429 });
  }

  const result = await startVerification(phone);
  if (!result.ok) {
    if (result.reason === "rate_limited") {
      return NextResponse.json({ ok: false, configured: true, error: "rate_limited" }, { status: 429 });
    }
    if (result.reason === "invalid_number") {
      return NextResponse.json({ ok: false, configured: true, error: "invalid_phone" }, { status: 400 });
    }
    console.error("[otp/send] Twilio start failed:", result.message);
    return NextResponse.json({ ok: false, configured: true, error: "send_failed" }, { status: 502 });
  }

  RECENT.set(phone, now);
  // Keep the map from growing unbounded on a long-lived instance.
  if (RECENT.size > 5000) RECENT.clear();

  return NextResponse.json({ ok: true, configured: true, sent: true });
}
