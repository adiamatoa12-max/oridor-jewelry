import { NextResponse } from "next/server";

/**
 * Lead capture — POST { contact: string, source?: string }.
 *
 * The promo popup collects an email OR an Israeli phone number and posts it
 * here. We save the lead as a Shopify CUSTOMER with email-marketing consent, so
 * it lands in the store's marketing audience (Shopify Admin → Customers).
 *
 * Credentials (server-only — NEVER prefix these with NEXT_PUBLIC):
 *   SHOPIFY_ADMIN_API_ACCESS_TOKEN   Admin API access token with `write_customers`
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN your-store.myshopify.com (already set)
 *
 * If the Admin token is absent, the endpoint still returns success so the
 * shopper's flow is never blocked — it just logs a warning that the lead was
 * not persisted. Set the token to start capturing for real.
 */

// Always run this on the server at request time — never statically cached.
export const dynamic = "force-dynamic";

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const ADMIN_API_VERSION = "2024-10";

/** Loose email check — good enough to reject obvious typos, not to gatekeep. */
function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/**
 * Normalise an Israeli phone number to E.164 (+972…), which Shopify requires.
 * Returns null if it doesn't look like a valid IL mobile/landline.
 */
function normalizeIsraeliPhone(raw: string): string | null {
  // Keep a leading +, drop everything else that isn't a digit.
  const cleaned = raw.replace(/[^\d+]/g, "");
  const digits = cleaned.replace(/\D/g, "");

  // Already international: +972XXXXXXXXX or 00972XXXXXXXXX
  if (cleaned.startsWith("+972")) {
    return digits.length >= 11 && digits.length <= 12 ? `+${digits}` : null;
  }
  if (digits.startsWith("972")) {
    return digits.length >= 11 && digits.length <= 12 ? `+${digits}` : null;
  }
  // Local format: 0XXXXXXXXX (10 digits) → +972XXXXXXXXX (drop the leading 0).
  if (digits.startsWith("0") && digits.length === 10) {
    return `+972${digits.slice(1)}`;
  }
  return null;
}

interface CustomerInput {
  email?: string;
  phone?: string;
  tags: string[];
  emailMarketingConsent?: {
    marketingState: "SUBSCRIBED";
    marketingOptInLevel: "SINGLE_OPT_IN";
  };
}

async function createShopifyCustomer(input: CustomerInput): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const endpoint = `https://${DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`;
  const query = /* GraphQL */ `
    mutation LeadCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer { id }
        userErrors { field message }
      }
    }
  `;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN as string,
    },
    body: JSON.stringify({ query, variables: { input } }),
    cache: "no-store",
  });

  if (!res.ok) {
    return { ok: false, error: `Shopify Admin request failed: ${res.status}` };
  }

  const json = (await res.json()) as {
    data?: {
      customerCreate?: {
        customer: { id: string } | null;
        userErrors: { field: string[] | null; message: string }[];
      };
    };
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    return { ok: false, error: json.errors.map((e) => e.message).join("; ") };
  }

  const userErrors = json.data?.customerCreate?.userErrors ?? [];
  if (userErrors.length) {
    // "Email has already been taken" / "Phone has already been taken" mean the
    // shopper is already in our list — that's a success from the UX's point of
    // view, not an error to surface.
    const alreadyExists = userErrors.some((e) =>
      /has already been taken/i.test(e.message),
    );
    if (alreadyExists) return { ok: true };
    return { ok: false, error: userErrors.map((e) => e.message).join("; ") };
  }

  return { ok: true };
}

export async function POST(request: Request) {
  let body: { contact?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const contact = typeof body.contact === "string" ? body.contact.trim() : "";
  const source = typeof body.source === "string" ? body.source.slice(0, 40) : "promo-popup";

  if (!contact) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  // Decide whether we got an email or a phone number.
  const email = isEmail(contact) ? contact.toLowerCase() : undefined;
  const phone = email ? undefined : normalizeIsraeliPhone(contact);

  if (!email && !phone) {
    return NextResponse.json(
      { ok: false, error: "invalid_contact" },
      { status: 400 },
    );
  }

  // Not configured yet: don't block the shopper. Log so the lead isn't silently
  // lost during setup, and report that it wasn't persisted.
  if (!DOMAIN || !ADMIN_TOKEN) {
    console.warn(
      `[lead] Shopify Admin not configured — lead NOT saved: ${email ?? phone} (source: ${source}). ` +
        `Set SHOPIFY_ADMIN_API_ACCESS_TOKEN (write_customers) to enable capture.`,
    );
    return NextResponse.json({ ok: true, stored: false });
  }

  const input: CustomerInput = {
    tags: [`lead:${source}`],
    ...(email
      ? {
          email,
          emailMarketingConsent: {
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN",
          },
        }
      : { phone: phone as string }),
  };

  try {
    const result = await createShopifyCustomer(input);
    if (!result.ok) {
      console.error(`[lead] Shopify customerCreate failed: ${result.error}`);
      // Still let the shopper through — we don't want a backend hiccup to trap
      // them in the popup. The warning above records the miss.
      return NextResponse.json({ ok: true, stored: false });
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[lead] unexpected error:", err);
    return NextResponse.json({ ok: true, stored: false });
  }
}
