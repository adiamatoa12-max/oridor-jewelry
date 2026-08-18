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
    revalidateTag(PRODUCTS_TAG);
    revalidatePath("/shop");
    revalidatePath("/");
    // Best-effort: refresh the changed product's own live page too.
    try {
      const body = JSON.parse(raw) as { handle?: string };
      if (body.handle) revalidatePath(`/products/${body.handle}`);
    } catch {
      /* delete payloads may not carry a handle — the listing refresh covers it */
    }
  }

  return NextResponse.json({ ok: true, topic });
}
