import { NextResponse } from "next/server";
import { normalizeIsraeliPhone } from "@/lib/phone";
import { isConfigured, checkVerification } from "@/lib/twilioVerify";

/**
 * Check a verification code — POST { phone: string, code: string }.
 *
 * Returns { ok: true, approved: boolean }. The caller only unlocks the discount
 * when approved === true. Twilio caps wrong-code attempts server-side, which we
 * surface as `too_many_attempts` / `expired` so the UI can offer a resend.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { phone?: unknown; code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const phone = normalizeIsraeliPhone(typeof body.phone === "string" ? body.phone : "");
  const code = typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";

  if (!phone) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }
  if (code.length < 4 || code.length > 8) {
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 400 });
  }

  // Should only be reached when configured; guard anyway.
  if (!isConfigured()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const result = await checkVerification(phone, code);
  if (!result.ok) {
    if (result.reason === "too_many_attempts") {
      return NextResponse.json({ ok: false, error: "too_many_attempts" }, { status: 429 });
    }
    if (result.reason === "expired") {
      return NextResponse.json({ ok: false, error: "expired" }, { status: 410 });
    }
    console.error("[otp/verify] Twilio check failed:", result.message);
    return NextResponse.json({ ok: false, error: "verify_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, approved: result.approved });
}
