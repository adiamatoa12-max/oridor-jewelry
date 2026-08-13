import { createHmac, randomInt, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Email one-time-code (OTP) for the VIP popup — no SMS, no database.
 *
 * We generate a 6-digit code, email it via Resend, and hand the browser a
 * STATELESS signed token. The token holds only { email, expiry, nonce } plus an
 * HMAC signature computed over (payload + code) with a server-only secret. The
 * code itself is never in the token, so a token holder can't brute-force the
 * code offline — verifying any guess requires the server secret. On verify we
 * recompute the HMAC from the submitted code and compare in constant time.
 *
 * Config (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY      — required to enable verification (else popup falls back)
 *   OTP_EMAIL_FROM      — optional sender, e.g. "Oridor <no-reply@oridorjewelry.com>".
 *                         Defaults to Resend's shared test sender for quick trials.
 *   OTP_SIGNING_SECRET  — optional HMAC secret; falls back to RESEND_API_KEY.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.OTP_EMAIL_FROM || "Oridor <onboarding@resend.dev>";
const SIGNING_SECRET = process.env.OTP_SIGNING_SECRET || RESEND_API_KEY || "";

const CODE_TTL_MS = 10 * 60 * 1000; // codes are valid for 10 minutes

export function isConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

/* ------------------------------------------------------------------ */
/* Code + token                                                        */
/* ------------------------------------------------------------------ */

/** A fresh 6-digit numeric code (crypto-strong, zero-padded). */
export function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payloadB64: string, code: string): string {
  return createHmac("sha256", SIGNING_SECRET).update(`${payloadB64}.${code}`).digest("base64url");
}

/** Build the opaque token the browser round-trips back on verify. */
export function issueToken(email: string, code: string): string {
  const payload = { e: email.toLowerCase(), x: Date.now() + CODE_TTL_MS, n: randomBytes(8).toString("hex") };
  const payloadB64 = b64url(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64, code)}`;
}

type TokenCheck = "ok" | "mismatch" | "expired" | "malformed";

/** Verify a submitted code against a token for the given email. */
export function verifyToken(token: string, email: string, code: string): TokenCheck {
  const parts = token.split(".");
  if (parts.length !== 2) return "malformed";
  const [payloadB64, sig] = parts;

  let payload: { e?: string; x?: number };
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return "malformed";
  }
  if (!payload.e || !payload.x) return "malformed";
  if (payload.e !== email.toLowerCase()) return "mismatch";
  if (Date.now() > payload.x) return "expired";

  const expected = sign(payloadB64, code);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return "mismatch";
  return "ok";
}

/* ------------------------------------------------------------------ */
/* Sending via Resend                                                  */
/* ------------------------------------------------------------------ */

export type SendResult = { ok: true } | { ok: false; message: string };

/** Email the code to the shopper via Resend's REST API (no SDK). */
export async function sendCodeEmail(email: string, code: string): Promise<SendResult> {
  const html = otpEmailHtml(code);
  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email],
        subject: `קוד האימות שלך: ${code}`,
        html,
      }),
      cache: "no-store",
    });
  } catch (e) {
    return { ok: false, message: `network: ${String(e)}` };
  }

  if (res.ok) return { ok: true };
  const body = await res.text().catch(() => "");
  return { ok: false, message: `HTTP ${res.status}: ${body.slice(0, 200)}` };
}

/** Minimal, on-brand RTL email with the code front and centre. */
function otpEmailHtml(code: string): string {
  return `<!doctype html><html dir="rtl" lang="he"><body style="margin:0;background:#faf9f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="440" cellpadding="0" cellspacing="0" style="max-width:440px;background:#ffffff;border:1px solid #eee6d8;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:36px 40px 8px;text-align:center;">
          <div style="font-size:22px;letter-spacing:.35em;color:#1a1a1a;font-weight:bold;">ORIDOR</div>
        </td></tr>
        <tr><td style="padding:8px 40px 4px;text-align:center;color:#4a4a4a;font-size:15px;">
          קוד האימות שלך למועדון ה-VIP
        </td></tr>
        <tr><td style="padding:20px 40px;text-align:center;">
          <div style="display:inline-block;background:#faf7f0;border:1px solid #eee6d8;border-radius:12px;padding:16px 28px;font-size:34px;font-weight:bold;letter-spacing:.35em;color:#1a1a1a;">${code}</div>
        </td></tr>
        <tr><td style="padding:4px 40px 36px;text-align:center;color:#6b6b6b;font-size:13px;line-height:1.7;">
          הזיני את הקוד בחלון כדי להשלים את ההצטרפות ולקבל 10% הנחה.<br/>הקוד תקף ל-10 דקות. אם לא ביקשת אותו, אפשר להתעלם מהודעה זו.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
