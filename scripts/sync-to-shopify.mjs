// @ts-nocheck
/**
 * One-off utility: push all local jewelry products to Shopify as DRAFTS.
 *
 * Reads the four local catalog JSON files, maps each item to Shopify's product
 * structure (title, price, color variants), and POSTs it to the Shopify Admin
 * REST API with status="draft" so nothing goes live until you review it.
 *
 * ── Requirements ────────────────────────────────────────────────────────────
 *  • Node 20+ (for native fetch + --env-file)
 *  • An ADMIN API access token with the `write_products` scope. The Storefront
 *    token in .env.local is read-only and will NOT work here.
 *
 * ── Env vars (put these in .env.local) ──────────────────────────────────────
 *  SHOPIFY_STORE_DOMAIN            your-store.myshopify.com   (no https://)
 *  SHOPIFY_ADMIN_API_ACCESS_TOKEN shpat_xxxxxxxxxxxxxxxxxxxxx
 *  NEXT_PUBLIC_SITE_URL           https://your-live-site  (for image import; optional)
 *
 * ── Run ─────────────────────────────────────────────────────────────────────
 *  Dry run (prints payloads, no writes):
 *      node --env-file=.env.local scripts/sync-to-shopify.mjs --dry-run
 *  Live run (creates drafts in Shopify):
 *      node --env-file=.env.local scripts/sync-to-shopify.mjs --live
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Config ──────────────────────────────────────────────────────────────────
const API_VERSION = "2024-10";
const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

const args = new Set(process.argv.slice(2));
const DRY_RUN = !args.has("--live"); // safe default: dry run unless --live is passed

// Shopify REST allows ~2 requests/sec on the standard bucket. Space calls out.
const REQUEST_DELAY_MS = 600;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Load local catalog ──────────────────────────────────────────────────────
const load = (name) =>
  JSON.parse(readFileSync(join(ROOT, "data", name), "utf8"));

const FILES = [
  "moissanite_collection.json",
  "silver_collection.json",
  "signature_collection.json",
  "new_arrivals.json",
];

const products = FILES.flatMap((f) => load(f).map((p) => ({ ...p, _source: f })));

// ── Map a local product → Shopify product payload ───────────────────────────
const abs = (path) =>
  path && SITE_URL ? `${SITE_URL}${encodeURI(path)}` : null;

function toShopifyPayload(p) {
  const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;

  // Collect a de-duplicated set of image srcs (main + each variant image).
  const imgPaths = [];
  const mainImg = p.image_url || (hasVariants ? p.variants[0].image_url : null);
  if (mainImg) imgPaths.push(mainImg);
  if (hasVariants) {
    for (const v of p.variants) if (v.image_url) imgPaths.push(v.image_url);
  }
  const images = [...new Set(imgPaths)]
    .map((path) => ({ src: abs(path) }))
    .filter((i) => i.src); // only if we have a public SITE_URL to serve them

  // Variants: map color options where they exist, else a single default variant.
  let options;
  let variants;
  if (hasVariants) {
    options = [{ name: "צבע" }]; // "Color"
    variants = p.variants.map((v) => ({
      option1: v.color, // e.g. כסף / זהב / זהב ורוד  (Silver / Gold / Rose Gold)
      price: Number(p.price).toFixed(2), // store currency (set store to ILS)
      inventory_management: null,
    }));
  } else {
    variants = [{ price: Number(p.price).toFixed(2), inventory_management: null }];
  }

  return {
    product: {
      title: p.name,
      body_html: p.material ? `<p>${p.material}</p>` : undefined,
      vendor: "Oridor",
      product_type: p.category || undefined,
      tags: [p.category, p._source.replace(".json", "")].filter(Boolean),
      status: "draft", // ← review before publishing
      handle: p.slug || undefined,
      ...(options ? { options } : {}),
      variants,
      ...(images.length ? { images } : {}),
    },
  };
}

// ── Create one product in Shopify ───────────────────────────────────────────
async function createProduct(payload) {
  const url = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/products.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — ${text}`);
  }
  return JSON.parse(text);
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🛍  Oridor → Shopify sync  (${products.length} products)`);
  console.log(`   mode: ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE — creating drafts"}`);
  console.log(`   images: ${SITE_URL ? `import from ${SITE_URL}` : "SKIPPED (set NEXT_PUBLIC_SITE_URL to a public host)"}\n`);

  if (!DRY_RUN) {
    if (!STORE_DOMAIN || !ADMIN_TOKEN) {
      console.error(
        "✖ Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_API_ACCESS_TOKEN.\n" +
          "  These must be Admin API credentials (write_products scope) — the\n" +
          "  Storefront token in .env.local is read-only and cannot create products.",
      );
      process.exit(1);
    }
  }

  let ok = 0;
  let failed = 0;

  for (const [i, p] of products.entries()) {
    const payload = toShopifyPayload(p);
    const label = `[${i + 1}/${products.length}] ${p.name}  (${payload.product.variants.length} variant${payload.product.variants.length > 1 ? "s" : ""})`;

    if (DRY_RUN) {
      console.log("• " + label);
      console.log("   " + JSON.stringify(payload.product).slice(0, 160) + "…");
      continue;
    }

    try {
      const result = await createProduct(payload);
      ok++;
      console.log(`✓ ${label}  → id ${result.product?.id}`);
    } catch (err) {
      failed++;
      console.error(`✖ ${label}\n   ${err.message}`);
    }
    await sleep(REQUEST_DELAY_MS); // stay under the rate limit
  }

  console.log(
    `\nDone. ${DRY_RUN ? `${products.length} products previewed (dry run).` : `created: ${ok}, failed: ${failed}.`}`,
  );
  if (DRY_RUN) console.log("Re-run with --live to actually create the drafts.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
