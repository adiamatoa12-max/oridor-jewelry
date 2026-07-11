/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy. Next.js injects small inline bootstrap scripts and
// inline styles, so 'unsafe-inline' is required without a nonce-based setup;
// dev additionally needs 'unsafe-eval' + ws: for HMR. This still meaningfully
// restricts external origins, framing, and object/base URIs.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // cdn.shopify.com serves the live cart line-item images.
  "img-src 'self' data: blob: https://images.unsplash.com https://cdn.shopify.com",
  "font-src 'self' data:",
  // *.myshopify.com — the Storefront GraphQL API (client-side cart mutations);
  // prod.spline.design serves the 3D vault-reward scene (.splinecode).
  `connect-src 'self' https://*.myshopify.com https://prod.spline.design https://unpkg.com${isDev ? " ws:" : ""}`,
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
    ];
  },
};

export default nextConfig;
