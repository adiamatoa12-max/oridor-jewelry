import { NextResponse } from "next/server";
import { getLiveCatalog, sortByPriceAsc } from "@/lib/catalog";

/**
 * Live catalog as JSON — lets client components (e.g. the search overlay) read
 * the 100%-live Shopify catalog without bundling any product data. Cached for
 * 60s and busted by the Shopify product webhook (via the shopify-products tag).
 */
export const revalidate = 60;

export async function GET() {
  const products = sortByPriceAsc(await getLiveCatalog());
  return NextResponse.json({ products });
}
