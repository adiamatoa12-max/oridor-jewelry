// @ts-nocheck
/**
 * One-off utility: export all local jewelry products to a Shopify-ready CSV.
 *
 * Reads the four local catalog JSON files and writes `shopify-products.csv`
 * using Shopify's standard product-import headers. Import it manually via
 * Shopify admin → Products → Import. No API token required.
 *
 * Products are exported as NOT published (Published = FALSE) so they land as
 * drafts for you to review before going live.
 *
 * ── Requirements ────────────────────────────────────────────────────────────
 *  • Node 20+ (for --env-file). Zero npm dependencies.
 *
 * ── Env (from .env.local) ───────────────────────────────────────────────────
 *  NEXT_PUBLIC_SITE_URL   https://your-live-site   (used to build absolute
 *                         Image Src URLs; if unset, Image Src is left blank)
 *
 * ── Run ─────────────────────────────────────────────────────────────────────
 *  node --env-file=.env.local scripts/generate-csv.mjs
 *  (or, without an env file:  NEXT_PUBLIC_SITE_URL=https://site node scripts/generate-csv.mjs)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const OUT = join(ROOT, "shopify-products.csv");

// Shopify's standard product-import columns (order matters).
const HEADERS = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Variant Price",
  "Variant Compare At Price",
  "Image Src",
];

// ── Load local catalog ──────────────────────────────────────────────────────
const load = (name) => JSON.parse(readFileSync(join(ROOT, "data", name), "utf8"));
const FILES = [
  "moissanite_collection.json",
  "silver_collection.json",
  "signature_collection.json",
  "new_arrivals.json",
];
const products = FILES.flatMap((f) => load(f).map((p) => ({ ...p, _source: f })));

// ── Helpers ─────────────────────────────────────────────────────────────────
const abs = (path) => (path && SITE_URL ? `${SITE_URL}${encodeURI(path)}` : "");

// RFC-4180 CSV cell: quote if it contains comma, quote, or newline; double quotes.
function cell(value) {
  const s = value == null ? "" : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Build the ordered image list for a product: main image first, then each
// variant image, de-duplicated.
function imagesFor(p, hasVariants) {
  const paths = [];
  const main = p.image_url || (hasVariants ? p.variants[0].image_url : null);
  if (main) paths.push(main);
  if (hasVariants) for (const v of p.variants) if (v.image_url) paths.push(v.image_url);
  return [...new Set(paths)];
}

// ── Build rows ──────────────────────────────────────────────────────────────
const rows = [];

for (const p of products) {
  const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
  const handle = p.slug || p.id;
  const price = Number(p.price).toFixed(2); // launch price, store currency (ILS)
  // "Compare At" = regular price → Shopify renders the strikethrough sale.
  const compareAt =
    p.compare_at_price && p.compare_at_price > p.price
      ? Number(p.compare_at_price).toFixed(2)
      : "";
  const tags = [p.category, p._source.replace(".json", "")].filter(Boolean).join(", ");
  const body = p.material ? `<p>${p.material}</p>` : "";
  const imgs = imagesFor(p, hasVariants);

  // Option axis: real colour variants → "צבע"/color; otherwise Shopify's
  // single-variant convention of Title / Default Title.
  const variantRows = hasVariants
    ? p.variants.map((v) => ({ optValue: v.color, price }))
    : [{ optValue: "Default Title", price }];
  const optName = hasVariants ? "צבע" : "Title";

  const maxRows = Math.max(variantRows.length, imgs.length, 1);

  for (let r = 0; r < maxRows; r++) {
    const first = r === 0;
    const variant = variantRows[r]; // may be undefined on image-only overflow rows
    rows.push([
      handle,
      first ? p.name : "",
      first ? body : "",
      first ? "Oridor" : "",
      first ? p.category || "" : "",
      first ? tags : "",
      first ? "FALSE" : "", // Published=FALSE → import as draft
      first ? optName : "",
      variant ? variant.optValue : "",
      variant ? variant.price : "",
      variant ? compareAt : "",
      imgs[r] ? abs(imgs[r]) : "",
    ]);
  }
}

// ── Write CSV ───────────────────────────────────────────────────────────────
const csv = [HEADERS, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
writeFileSync(OUT, csv, "utf8");

const variantCount = rows.filter((r) => r[9] !== "").length;
console.log(`✓ Wrote ${OUT}`);
console.log(`  ${products.length} products · ${variantCount} variant rows · ${rows.length} total rows`);
console.log(`  Image Src: ${SITE_URL ? `absolute from ${SITE_URL}` : "BLANK (set NEXT_PUBLIC_SITE_URL to include images)"}`);
console.log(`  Published = FALSE on every product (imports as draft).`);
