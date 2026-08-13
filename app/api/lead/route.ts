import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isEmail, normalizeIsraeliPhone } from "@/lib/phone";

/**
 * Lead capture — POST { email?, phone?, contact?, source?, phoneVerified? }.
 *
 * The promo popup collects an email and (once phone verification is enabled) an
 * SMS-verified Israeli phone, and posts them here. A single `contact` string is
 * still accepted for the older email-OR-phone callers. We save the lead as a
 * Shopify CUSTOMER with email-marketing consent, so it lands in the store's
 * marketing audience (Shopify Admin → Customers).
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

/** Shopify treats these as "the lead is already on our list" — a UX success. */
function isAlreadyExists(message: string): boolean {
  return /has already been taken|already registered|taken/i.test(message);
}

type SaveResult = { ok: true; stored: boolean } | { ok: false; error: string };

/* ------------------------------------------------------------------ */
/* Admin API path                                                      */
/* ------------------------------------------------------------------ */

async function saveViaAdmin(
  email?: string,
  phone?: string,
  source = "promo-popup",
  phoneVerified = false,
): Promise<SaveResult> {
  const endpoint = `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`;
  const tags = [`lead:${source}`];
  if (phoneVerified && phone) tags.push("phone-verified");
  const input: Record<string, unknown> = { tags };
  // Store whatever we have — email and phone can both be present now.
  if (email) {
    input.email = email;
    input.emailMarketingConsent = {
      marketingState: "SUBSCRIBED",
      marketingOptInLevel: "SINGLE_OPT_IN",
    };
  }
  if (phone) {
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
  let body: { contact?: unknown; email?: unknown; phone?: unknown; source?: unknown; phoneVerified?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const contact = typeof body.contact === "string" ? body.contact.trim() : "";
  const source = typeof body.source === "string" ? body.source.slice(0, 40) : "promo-popup";
  const phoneVerified = body.phoneVerified === true;

  // Explicit email/phone fields take precedence; fall back to the legacy single
  // `contact` (email OR phone) for older callers.
  const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
  const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";

  const email =
    (rawEmail && isEmail(rawEmail) ? rawEmail : isEmail(contact) ? contact : "").toLowerCase() ||
    undefined;
  const phone =
    normalizeIsraeliPhone(rawPhone) ?? (!email ? normalizeIsraeliPhone(contact) : null) ?? undefined;

  if (!email && !phone) {
    return NextResponse.json({ ok: false, error: "invalid_contact" }, { status: 400 });
  }

  // Choose the path by which credential exists. Admin is preferred; Storefront
  // is the zero-setup fallback that uses the already-configured public token.
  try {
    let result: SaveResult;

    if (DOMAIN && ADMIN_TOKEN) {
      result = await saveViaAdmin(email, phone ?? undefined, source, phoneVerified);
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
