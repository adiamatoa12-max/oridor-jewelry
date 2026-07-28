import { Crown } from "lucide-react";
import ClubSignup from "./ClubSignup";

/**
 * VIP club sign-up band for the homepage — a warm, boutique invitation to join
 * the customer club for an instant 10% welcome discount. The form + discount
 * activation + welcome message all live in <ClubSignup/>.
 */
export default function VipClub() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">
        {/* Soft gold glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-lg">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/30">
            <Crown size={22} strokeWidth={1.5} className="text-gold" />
          </span>

          <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-gold">
            מועדון ה-VIP של Oridor
          </p>
          <h2 className="mt-2.5 font-display text-3xl font-semibold leading-snug text-cream sm:text-4xl">
            הצטרפי וקבלי 10% הנחה
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-platinum/70">
            חברות המועדון נהנות מ-10% הנחה על ההזמנה הראשונה, גישה מוקדמת
            לקולקציות חדשות ומבצעים סגורים. ההנחה מופעלת אוטומטית עם ההצטרפות.
          </p>

          <div className="mx-auto mt-8 max-w-sm">
            <ClubSignup tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
