import { NextResponse } from "next/server";
import { getGiftOptions } from "@/lib/giftOptions";

// Runs server-side only, so the Admin token (when set) never reaches the
// browser. The cart drawer calls this lazily, once the 2+1 tier is reached.
export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  try {
    const gifts = await getGiftOptions();
    return NextResponse.json({ gifts });
  } catch {
    // Never fail the drawer on this — an empty list simply renders the
    // "no gifts available" state rather than breaking the cart.
    return NextResponse.json({ gifts: [] }, { status: 200 });
  }
}
