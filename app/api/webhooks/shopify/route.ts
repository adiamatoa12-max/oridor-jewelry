import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { PRODUCTS_TAG } from "@/lib/shopify";

/**
 * Shopify webhook receiver — keeps the "Hybrid Append" catalog in sync.
 *
 * On a verified product event (create / update / delete) it busts the live
 * product cache and revalidates the listing surfaces, so a newly published
 * Shopify product appears on the site within seconds instead of waiting out the
 * 60s revalidate window.
 *
 * Security: every request is verified with HMAC-SHA256 over the RAW body using
 * SHOPIFY_WEBHOOK_SECRET (the signing secret shown in Shopify Admin → Settings →
 * Notifications → Webhooks). Until that secret is set the route is inert — it
 * acknowledges with 200 but does no work — so it never errors Shopify's delivery
 * and never acts on an unverified request.
 */
export const dynamic = "force-dynamic";

const SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
/** "My Store Headless" publication — the sales channel the site reads. */
const HEADLESS_PUBLICATION_ID = process.env.SHOPIFY_HEADLESS_PUBLICATION_ID;

/**
 * Auto-publish a newly-created product to the headless channel so it appears on
 * the live site without a manual "add to sales channel" step. No-op unless the
 * Admin token + publication id are configured.
 */
async function autoPublishToHeadless(productGid: string): Promise<void> {
  if (!DOMAIN || !ADMIN_TOKEN || !HEADLESS_PUBLICATION_ID) return;
  const query = /* GraphQL */ `
    mutation Publish($id: ID!, $pub: ID!) {
      publishablePublish(id: $id, input: [{ publicationId: $pub }]) {
        userErrors { field message }
      }
    }
  `;
  const res = await fetch(`https://${DOMAIN}/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": ADMIN_TOKEN },
    body: JSON.stringify({ query, variables: { id: productGid, pub: HEADLESS_PUBLICATION_ID } }),
    cache: "no-store",
  });
  if (!res.ok) console.error(`[shopify-webhook] auto-publish failed: ${res.status}`);
}

export async function POST(request: Request) {
  const raw = await request.text();
  const topic = request.headers.get("x-shopify-topic") ?? "";
  const sentHmac = request.headers.get("x-shopify-hmac-sha256") ?? "";

  if (!SECRET) {
    console.warn(`[shopify-webhook] SHOPIFY_WEBHOOK_SECRET not set — ignoring "${topic}"`);
    return NextResponse.json({ ok: true, configured: false });
  }

  // Verify the signature in constant time.
  const digest = crypto.createHmac("sha256", SECRET).update(raw, "utf8").digest("base64");
  const a = Buffer.from(digest);
  const b = Buffer.from(sentHmac);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false, error: "invalid_hmac" }, { status: 401 });
  }

  // Any product change → refresh live product data + the surfaces that list it.
  if (topic.startsWith("products/")) {
    let payload: { handle?: string; admin_graphql_api_id?: string } = {};
    try {
      payload = JSON.parse(raw);
    } catch {
      /* delete payloads may be minimal — the listing refresh below still runs */
    }

    // A brand-new product → auto-publish it to the headless channel so it shows
    // up on the site without the manual "add to sales channel" step.
    if (topic === "products/create" && payload.admin_graphql_api_id) {
      await autoPublishToHeadless(payload.admin_graphql_api_id).catch(() => {});
    }

    revalidateTag(PRODUCTS_TAG);
    revalidatePath("/shop");
    revalidatePath("/");
    if (payload.handle) revalidatePath(`/products/${payload.handle}`);
  }

  return NextResponse.json({ ok: true, topic });
}
