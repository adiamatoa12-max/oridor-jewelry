import { NextResponse } from "next/server";

/**
 * Returns the currently-deployed build's commit SHA. Because it is
 * force-dynamic + no-store, every request hits the live deployment, so an
 * already-open tab can compare this against the SHA it loaded with and reload
 * itself when a newer version has shipped.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  return NextResponse.json(
    { v: process.env.VERCEL_GIT_COMMIT_SHA || "dev" },
    { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
  );
}
