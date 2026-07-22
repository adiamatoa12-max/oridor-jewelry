/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy. Next.js injects small inline bootstrap scripts and
// inline styles, so 'unsafe-inline' is required without a nonce-based setup;
// dev additionally needs 'unsafe-eval' + ws: for HMR. This still meaningfully
// restricts external origins, framing, and object/base URIs.
const csp = [
  "default-src 'self'",
  // connect.facebook.net serves the Meta Pixel loader (fbevents.js).
  `script-src 'self' 'unsafe-inline' https://connect.facebook.net${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // cdn.shopify.com serves the live cart line-item images; facebook.com serves
  // the Meta Pixel's <noscript> tracking image.
  "img-src 'self' data: blob: https://images.unsplash.com https://cdn.shopify.com https://www.facebook.com",
  "font-src 'self' data:",
  // *.myshopify.com — the Storefront GraphQL API (client-side cart mutations);
  // prod.spline.design serves the 3D vault-reward scene (.splinecode);
  // facebook.com / connect.facebook.net receive the Meta Pixel's event beacons.
  `connect-src 'self' https://*.myshopify.com https://prod.spline.design https://unpkg.com https://www.facebook.com https://connect.facebook.net${isDev ? " ws:" : ""}`,
  "worker-src 'self' blob:",
  "media-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    // Serve modern, smaller formats automatically (AVIF, then WebP fallback).
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Collections now live at plural /collections/* routes. Permanently
    // redirect any old singular /collection/* links to the new URLs for SEO.
    return [
      {
        source: "/collection/:path*",
        destination: "/collections/:path*",
        permanent: true,
      },
      // The quality page is now the richer /quality-warranty. Redirect the old
      // URL permanently to preserve any existing links and SEO equity.
      {
        source: "/quality",
        destination: "/quality-warranty",
        permanent: true,
      },
      // "שרשרת תליון אובל" (silver-2) was merged into the single variant product
      // "שרשרת אובל סוליטר" (signature/oval-necklace). Redirect the retired
      // duplicate URL so no link or SEO equity is lost.
      {
        source: "/collections/silver/silver-2",
        destination: "/collections/signature/oval-necklace",
        permanent: true,
      },
      // Four discontinued earring products, removed from the catalog. Redirect
      // their retired URLs to the Moissanite collection to preserve SEO/links.
      // matan-23 עגילי לב סוליטר · matan-25 עגילי סוליטר ·
      // matan-24 עגילי הילה כפולה · matan-22 עגילי טיפה הילה
      {
        source:
          "/collections/moissanite/:slug(matan-22|matan-23|matan-24|matan-25)",
        destination: "/collections/moissanite",
        permanent: true,
      },
      // Three duplicate/retired listings deleted from Shopify. silver-42 was a
      // duplicate of the marquise ring silver-1 → redirect to its main; the
      // other two go to the Silver collection.
      {
        source: "/collections/silver/silver-42",
        destination: "/collections/silver/silver-1",
        permanent: true,
      },
      {
        source: "/collections/silver/:slug(silver-7|silver-12)",
        destination: "/collections/silver",
        permanent: true,
      },
      // "צמיד עדין נוצץ" (silver-11) deleted from Shopify. Redirect its URL.
      {
        source: "/collections/silver/silver-11",
        destination: "/collections/silver",
        permanent: true,
      },
      // The signature and new-arrival listings were folded into the single
      // silver collection, since every piece in them is solid 925 and showing
      // them twice split the listing across duplicate URLs.
      //
      // These match the collection INDEX only. The /[slug] product routes below
      // them still exist and must keep resolving — a signature piece lives at
      // /collections/signature/<slug> and is merely listed on the silver page.
      {
        source: "/collections/signature",
        destination: "/collections/silver",
        permanent: true,
      },
      {
        source: "/collections/new",
        destination: "/collections/silver",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
