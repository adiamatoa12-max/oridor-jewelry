/**
 * Normalise an Israeli phone number to E.164 (+972…), the format Shopify and
 * Twilio both require. Returns null if it doesn't look like a valid IL
 * mobile/landline. Shared by the lead-capture and OTP-verification routes so
 * "the same number" always means the same thing across the flow.
 */
export function normalizeIsraeliPhone(raw: string): string | null {
  const cleaned = raw.replace(/[^\d+]/g, "");
  const digits = cleaned.replace(/\D/g, "");

  if (cleaned.startsWith("+972")) {
    return digits.length >= 11 && digits.length <= 12 ? `+${digits}` : null;
  }
  if (digits.startsWith("972")) {
    return digits.length >= 11 && digits.length <= 12 ? `+${digits}` : null;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+972${digits.slice(1)}`;
  }
  return null;
}

/** Loose client/server email check — rejects obvious typos, not a gatekeeper. */
export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
