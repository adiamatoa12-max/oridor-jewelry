"use client";

import Link from "next/link";

const SERVICE_LINKS = [
  { label: "צור קשר", href: "/contact" },
  { label: "איכות ואותנטיות", href: "/quality" },
  { label: "משלוחים והחזרות", href: "/shipping" },
  { label: "שאלות נפוצות", href: "/faq" },
  { label: "תקנון האתר", href: "/terms" },
];

const COLLECTION_LINKS = [
  { label: "שרשראות", href: "/necklaces" },
  { label: "צמידים", href: "/bracelets" },
  { label: "עגילים", href: "/earrings" },
  { label: "טבעות", href: "/rings" },
];

/**
 * Premium site footer — airy pearl-gray, four-column grid, newsletter signup,
 * and a thin copyright bar. Charcoal/graphite text; no black, no gold.
 */
export default function PremiumFooter() {
  return (
    <footer className="bg-[#F8F8F8] text-charcoal">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-16">
        {/* Brand */}
        <div>
          <span className="text-2xl font-light uppercase tracking-brand text-charcoal">
            Oridor
          </span>
          <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-graphite">
            תכשיטים על-זמניים המעוצבים מתוך אהבה לאסתטיקה נקייה ויוקרה יומיומית.
          </p>
        </div>

        {/* Customer service */}
        <FooterColumn title="שירות לקוחות" links={SERVICE_LINKS} />

        {/* Collections */}
        <FooterColumn title="הקולקציות" links={COLLECTION_LINKS} />

        {/* Newsletter */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-charcoal">
            הצטרפי למועדון
          </h3>
          <p className="mt-4 text-sm font-light leading-relaxed text-graphite">
            קבלו 10% הנחה על ההזמנה הראשונה.
          </p>
          <form
            className="mt-6 flex items-center gap-3 border-b border-platinum pb-2 focus-within:border-silver"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="כתובת אימייל"
              aria-label="כתובת אימייל"
              className="w-full bg-transparent text-sm font-light text-charcoal placeholder:text-ash focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 text-xs font-medium uppercase tracking-wide text-charcoal transition-colors duration-300 hover:text-graphite"
            >
              הרשמה
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-platinum/60">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center sm:px-10 lg:px-16">
          <p className="text-xs font-light text-ash">
            © 2026 Oridor. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-charcoal">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-light text-gray-500 transition-colors duration-300 hover:text-charcoal"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
