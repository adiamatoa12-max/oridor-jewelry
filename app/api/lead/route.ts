import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

/**
 * Lead capture — POST { contact: string, source?: string }.
 *
 * The promo popup collects an email OR an Israeli phone number and posts it
 * here. We save the lead as a Shopify CUSTOMER with email-marketing consent, so
 * it lands in the store's marketing audience (Shopify Admin → Customers).
 *
 * Two ways to reach Shopify, chosen automatically by which credential exists:
 *
 *  1. Admin API (preferred) — set SHOPIFY_ADMIN_API_ACCESS_TOKEN (scope
 *     `write_customers`). Handles email AND phone-only leads and sets marketing
 *     consent explicitly.
 *
 *  2. Storefront API (fallback, no extra setup) — uses the public
 *     NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN the store already has. The
 *     Storefront `customerCreate` requires email + password, so we generate a
 *     strong random password (the shopper never sees or needs it — it's a
 *     marketing signup, not an account login) and set acceptsMarketing. Phone-
 *     only leads can't use this path (Storefront requires an email).
 *
 * The endpoint never blocks the shopper: on any misconfig or error it still
 * returns { ok: true } and logs, so the popup flow always completes.
 */

// Always run on the server at request time — never statically cached.
export const dynamic = "force-dynamic";

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2024-10";

/** Loose email check — good enough to reject obvious typos, not to gatekeep. */
function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/**
 * Normalise an Israeli phone number to E.164 (+972…), which Shopify requires.
 * Returns null if it doesn't look like a valid IL mobile/landline.
 */
function normalizeIsraeliPhone(raw: string): string | null {
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

/** Shopify treats these as "the lead is already on our list" — a UX success. */
function isAlreadyExists(message: string): boolean {
  return /has already been taken|already registered|taken/i.test(message);
}

type SaveResult = { ok: true; stored: boolean } | { ok: false; error: string };

/* ------------------------------------------------------------------ */
/* Admin API path                                                      */
/* ------------------------------------------------------------------ */

async function saveViaAdmin(email?: string, phone?: string, source = "promo-popup"): Promise<SaveResult> {
  const endpoint = `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`;
  const input: Record<string, unknown> = { tags: [`lead:${source}`] };
  if (email) {
    input.email = email;
    input.emailMarketingConsent = {
      marketingState: "SUBSCRIBED",
      marketingOptInLevel: "SINGLE_OPT_IN",
    };
  } else if (phone) {
    input.phone = phone;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN as string,
    },
    body: JSON.stringify({
      query: /* GraphQL */ `
        mutation LeadCreate($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer { id }
            userErrors { field message }
          }
        }
      `,
      variables: { input },
    }),
    cache: "no-store",
  });

  if (!res.ok) return { ok: false, error: `Admin request failed: ${res.status}` };

  const json = (await res.json()) as {
    data?: { customerCreate?: { customer: { id: string } | null; userErrors: { message: string }[] } };
    errors?: { message: string }[];
  };

  if (json.errors?.length) return { ok: false, error: json.errors.map((e) => e.message).join("; ") };

  const userErrors = json.data?.customerCreate?.userErrors ?? [];
  if (userErrors.length) {
    if (userErrors.some((e) => isAlreadyExists(e.message))) return { ok: true, stored: true };
    return { ok: false, error: userErrors.map((e) => e.message).join("; ") };
  }
  return { ok: true, stored: true };
}

/* ------------------------------------------------------------------ */
/* Storefront API path (uses the public token already configured)      */
/* ------------------------------------------------------------------ */

async function saveViaStorefront(email: string): Promise<SaveResult> {
  const endpoint = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;
  // A password is mandatory for Storefront customerCreate. It's never shown to
  // the shopper — this is a marketing signup, not an account they log into.
  const password = `Or!${randomUUID()}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN as string,
    },
    body: JSON.stringify({
      query: /* GraphQL */ `
        mutation LeadCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customer { id }
            customerUserErrors { code field message }
          }
        }
      `,
      variables: { input: { email, password, acceptsMarketing: true } },
    }),
    cache: "no-store",
  });

  if (!res.ok) return { ok: false, error: `Storefront request failed: ${res.status}` };

  const json = (await res.json()) as {
    data?: { customerCreate?: { customer: { id: string } | null; customerUserErrors: { code: string | null; message: string }[] } };
    errors?: { message: string }[];
  };

  if (json.errors?.length) return { ok: false, error: json.errors.map((e) => e.message).join("; ") };

  const userErrors = json.data?.customerCreate?.customerUserErrors ?? [];
  if (userErrors.length) {
    // TAKEN / already-registered means they're already captured — success.
    if (userErrors.some((e) => e.code === "TAKEN" || e.code === "CUSTOMER_DISABLED" || isAlreadyExists(e.message))) {
      return { ok: true, stored: true };
    }
    return { ok: false, error: userErrors.map((e) => e.message).join("; ") };
  }
  return { ok: true, stored: true };
}

/* ------------------------------------------------------------------ */
/* Route                                                               */
/* ------------------------------------------------------------------ */

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

  const email = isEmail(contact) ? contact.toLowerCase() : undefined;
  const phone = email ? undefined : normalizeIsraeliPhone(contact);

  if (!email && !phone) {
    return NextResponse.json({ ok: false, error: "invalid_contact" }, { status: 400 });
  }

  // Choose the path by which credential exists. Admin is preferred; Storefront
  // is the zero-setup fallback that uses the already-configured public token.
  try {
    let result: SaveResult;

    if (DOMAIN && ADMIN_TOKEN) {
      result = await saveViaAdmin(email, phone ?? undefined, source);
    } else if (DOMAIN && STOREFRONT_TOKEN && email) {
      result = await saveViaStorefront(email);
    } else if (DOMAIN && STOREFRONT_TOKEN && phone) {
      // Storefront can't create a phone-only customer (email is required).
      console.warn(
        `[lead] phone-only lead can't be saved via Storefront (needs Admin API): ${phone} (${source}). ` +
          `Set SHOPIFY_ADMIN_API_ACCESS_TOKEN to capture phone leads.`,
      );
      return NextResponse.json({ ok: true, stored: false });
    } else {
      console.warn(
        `[lead] Shopify not configured — lead NOT saved: ${email ?? phone} (${source}).`,
      );
      return NextResponse.json({ ok: true, stored: false });
    }

    if (!result.ok) {
      console.error(`[lead] Shopify customerCreate failed: ${result.error}`);
      // Don't trap the shopper on a backend hiccup — the warning records the miss.
      return NextResponse.json({ ok: true, stored: false });
    }
    return NextResponse.json({ ok: true, stored: result.stored });
  } catch (err) {
    console.error("[lead] unexpected error:", err);
    return NextResponse.json({ ok: true, stored: false });
  }
}
