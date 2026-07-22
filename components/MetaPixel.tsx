import Script from "next/script";

/**
 * Meta (Facebook) Pixel — base install.
 *
 * Mounted once in the root layout, so it loads on every route. `next/script`
 * with `afterInteractive` injects the loader into the document head and runs
 * it after hydration, which is Meta's recommended placement for the base code.
 *
 * NOTE: this fires a single PageView on initial load. In an App-Router SPA,
 * client-side route changes do NOT reload the page, so they will not emit a
 * new PageView on their own. If you need per-navigation PageViews, that needs
 * a usePathname() effect calling fbq('track','PageView') — deliberately left
 * out here, since the base snippet you supplied only tracks the first load.
 *
 * The CSP in next.config.mjs is what actually lets this run; connect.facebook.net
 * and facebook.com are whitelisted there. Without it the browser blocks the
 * pixel silently.
 */
const PIXEL_ID = "2090078638546650";

export default function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
