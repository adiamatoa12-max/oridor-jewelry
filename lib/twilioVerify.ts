/**
 * Thin wrapper over Twilio Verify's REST API — no SDK dependency, just `fetch`,
 * matching this repo's dependency-light style.
 *
 * Twilio Verify is a MANAGED OTP service: Twilio generates the code, sends the
 * SMS, stores it, expires it, caps attempts, and rate-limits per phone. We never
 * see or store the code ourselves — we only ask Twilio to "start a verification"
 * and later "check" a code. That's why no Redis/DB is needed on our side.
 *
 * Configure via env (Vercel → Project → Settings → Environment Variables):
 *   TWILIO_ACCOUNT_SID          — starts with "AC…"
 *   TWILIO_AUTH_TOKEN           — the account auth token
 *   TWILIO_VERIFY_SERVICE_SID   — the Verify Service SID, starts with "VA…"
 *
 * Until all three exist, `isConfigured()` is false and the caller falls back to
 * the email-only signup so the popup never breaks.
 */

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

export function isConfigured(): boolean {
  return Boolean(ACCOUNT_SID && AUTH_TOKEN && SERVICE_SID);
}

function authHeader(): string {
  const basic = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString("base64");
  return `Basic ${basic}`;
}

/** Twilio error codes we translate into friendly, actionable outcomes. */
const MAX_SEND = 60203; // Max send attempts reached for this phone
const MAX_CHECK = 60202; // Max check attempts reached (too many wrong codes)
const NOT_FOUND = 20404; // No pending verification (expired / never sent)

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "rate_limited" | "invalid_number" | "error"; message: string };

export type CheckResult =
  | { ok: true; approved: boolean }
  | { ok: false; reason: "too_many_attempts" | "expired" | "error"; message: string };

/** Start a verification — Twilio sends the SMS code to `phone` (E.164). */
export async function startVerification(phone: string, locale = "he"): Promise<SendResult> {
  const url = `https://verify.twilio.com/v2/Services/${SERVICE_SID}/Verifications`;
  const body = new URLSearchParams({ To: phone, Channel: "sms", Locale: locale });

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { Authorization: authHeader(), "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
  } catch (e) {
    return { ok: false, reason: "error", message: `network: ${String(e)}` };
  }

  if (res.ok) return { ok: true };

  const err = (await res.json().catch(() => ({}))) as { code?: number; message?: string };
  if (err.code === MAX_SEND || res.status === 429) {
    return { ok: false, reason: "rate_limited", message: err.message ?? "rate limited" };
  }
  if (err.code === 60200 || err.code === 21211 || err.code === 21610) {
    return { ok: false, reason: "invalid_number", message: err.message ?? "invalid number" };
  }
  return { ok: false, reason: "error", message: err.message ?? `HTTP ${res.status}` };
}

/** Check a code the shopper entered against the pending verification. */
export async function checkVerification(phone: string, code: string): Promise<CheckResult> {
  const url = `https://verify.twilio.com/v2/Services/${SERVICE_SID}/VerificationCheck`;
  const body = new URLSearchParams({ To: phone, Code: code });

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { Authorization: authHeader(), "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
  } catch (e) {
    return { ok: false, reason: "error", message: `network: ${String(e)}` };
  }

  if (res.ok) {
    const json = (await res.json().catch(() => ({}))) as { status?: string };
    return { ok: true, approved: json.status === "approved" };
  }

  const err = (await res.json().catch(() => ({}))) as { code?: number; message?: string };
  if (err.code === MAX_CHECK) {
    return { ok: false, reason: "too_many_attempts", message: err.message ?? "too many attempts" };
  }
  if (err.code === NOT_FOUND) {
    // No pending verification — treat as expired so the UI offers a resend.
    return { ok: false, reason: "expired", message: err.message ?? "expired" };
  }
  return { ok: false, reason: "error", message: err.message ?? `HTTP ${res.status}` };
}
