import { NextResponse } from "next/server";
import { isEmail } from "@/lib/phone";
import { isConfigured, verifyToken } from "@/lib/emailOtp";

/**
 * Check an email verification code — POST { email, code, token }.
 *
 * Recomputes the HMAC over (token payload + submitted code) and compares it to
 * the token's signature in constant time. Returns { ok: true, approved: boolean }.
 * The caller only unlocks the discount when approved === true.
 *
 * Best-effort per-instance brute-force guard: a handful of wrong attempts per
 * token nonce trips a lockout. Combined with the 10-minute code expiry and the
 * send-side throttle this keeps online guessing impractical without a database.
 */
export const dynamic = "force-dynamic";

const ATTEMPTS = new Map<string, number>();
const MAX_ATTEMPTS = 6;

export async function POST(request: Request) {
  let body: { email?: unknown; code?: unknown; token?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";
  const token = typeof body.token === "string" ? body.token : "";

  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (code.length < 4 || code.length > 8) {
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 400 });
  }
  if (!token) {
    return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
  }
  if (!isConfigured()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  // Rate-limit guesses per token (nonce = the token's payload segment).
  const key = token.split(".")[0] ?? token;
  const used = ATTEMPTS.get(key) ?? 0;
  if (used >= MAX_ATTEMPTS) {
    return NextResponse.json({ ok: false, error: "too_many_attempts" }, { status: 429 });
  }

  const result = verifyToken(token, email, code);
  if (result === "ok") {
    ATTEMPTS.delete(key);
    return NextResponse.json({ ok: true, approved: true });
  }

  if (result === "expired") {
    return NextResponse.json({ ok: false, error: "expired" }, { status: 410 });
  }
  if (result === "malformed") {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }

  // Wrong code — count the attempt, keep the map from growing unbounded.
  ATTEMPTS.set(key, used + 1);
  if (ATTEMPTS.size > 5000) ATTEMPTS.clear();
  return NextResponse.json({ ok: true, approved: false });
}
