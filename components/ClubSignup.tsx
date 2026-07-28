"use client";

import { useState } from "react";
import { Sparkles, Check, ArrowLeft } from "lucide-react";
import { useCart } from "./CartContext";

/**
 * The club welcome discount code. It must exist in Shopify (Discounts → a code
 * discount, 10% off, e.g. "WELCOME10"). Set NEXT_PUBLIC_CLUB_WELCOME_CODE to
 * match your code; the app applies it to the shopper's cart on sign-up so the
 * 10% is live for the session and carries to checkout.
 */
const WELCOME_CODE = process.env.NEXT_PUBLIC_CLUB_WELCOME_CODE || "WELCOME10";

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/**
 * VIP / loyalty club sign-up. On submit it captures the email (as a Shopify
 * customer, via /api/lead) and activates a 10% welcome discount on the session's
 * cart, then shows a clear welcome + confirmation. Tone-aware so it drops into a
 * light section or the dark footer.
 */
export default function ClubSignup({
  tone = "light",
  layout = "inline",
  ctaLabel = "הצטרפי וקבלי 10% הנחה",
  onSuccess,
}: {
  tone?: "light" | "dark";
  /** "inline" = underline field + round arrow (footer/section); "stacked" =
   *  boxed field above a prominent full-width gold button (popup). */
  layout?: "inline" | "stacked";
  /** Label for the prominent button in the "stacked" layout. */
  ctaLabel?: string;
  /** Fired once the shopper has successfully joined (e.g. so a host popup can
   *  mark itself dismissed). */
  onSuccess?: () => void;
}) {
  const { applyDiscount } = useCart();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const dark = tone === "dark";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "submitting") return;
    if (!isEmail(email)) {
      setError("נא להזין כתובת אימייל תקינה");
      return;
    }
    setState("submitting");
    setError(null);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: email.trim(), source: "vip-club" }),
      });
    } catch {
      /* capture is best-effort — never block joining on a network hiccup */
    }
    // Activate the 10% welcome discount on this shopper's cart.
    applyDiscount(WELCOME_CODE);
    setState("done");
    onSuccess?.();
  };

  /* -------- Success / onboarding state -------- */
  if (state === "done") {
    return (
      <div
        className={`flex items-start gap-3 rounded-xl p-4 ${
          dark
            ? "bg-gold/10 ring-1 ring-gold/25"
            : "bg-emerald-50 ring-1 ring-emerald-600/15"
        }`}
      >
        <span
          className={`mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full ${
            dark ? "bg-gold text-[#0a0a0a]" : "bg-emerald-600 text-white"
          }`}
        >
          <Check size={16} strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold ${
              dark ? "text-cream" : "text-emerald-800"
            }`}
          >
            ברוכה הבאה למועדון ה-VIP! 🎉
          </p>
          <p
            className={`mt-1 text-[13px] font-light leading-relaxed ${
              dark ? "text-platinum/70" : "text-emerald-700"
            }`}
          >
            הנחת 10% הופעלה לך אוטומטית וכבר מחכה בעגלה. הקוד שלך:{" "}
            <span
              className={`font-semibold tracking-wide ${
                dark ? "text-gold" : "text-emerald-800"
              }`}
            >
              {WELCOME_CODE}
            </span>
          </p>
        </div>
      </div>
    );
  }

  /* -------- Stacked layout: boxed field + prominent gold button (popup) -------- */
  if (layout === "stacked") {
    return (
      <form onSubmit={submit} noValidate className="w-full">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="rtl"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="כתובת אימייל"
          aria-label="כתובת אימייל להצטרפות למועדון"
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border px-4 py-3 text-center text-sm transition-colors focus:outline-none focus:ring-1 ${
            dark
              ? "border-white/15 bg-white/[0.06] text-cream placeholder:text-platinum/40 focus:border-gold focus:ring-gold/60"
              : "border-charcoal/15 bg-canvas text-charcoal placeholder:text-ash focus:border-gold focus:ring-gold/50"
          }`}
        />

        {error && (
          <p className="mt-2 text-center text-xs font-light text-[#e7a89a]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="btn-gold mt-3 w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "submitting" ? (
            "רק רגע…"
          ) : (
            <span className="inline-flex items-center gap-2">
              <Sparkles size={15} strokeWidth={2} />
              {ctaLabel}
            </span>
          )}
        </button>
      </form>
    );
  }

  /* -------- Inline layout: underline field + round arrow (footer/section) -------- */
  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div
        className={`group flex items-center gap-2 border-b pb-2.5 transition-colors ${
          dark
            ? "border-white/20 focus-within:border-gold"
            : "border-charcoal/20 focus-within:border-gold"
        }`}
      >
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="rtl"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="כתובת אימייל"
          aria-label="כתובת אימייל להצטרפות למועדון"
          aria-invalid={Boolean(error)}
          className={`w-full bg-transparent text-sm font-light focus:outline-none ${
            dark
              ? "text-cream placeholder:text-platinum/40"
              : "text-charcoal placeholder:text-ash"
          }`}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          aria-label="הצטרפות למועדון"
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-60 ${
            dark
              ? "border-gold/50 text-gold hover:bg-gold hover:text-ink"
              : "border-gold/50 text-gold hover:bg-gold hover:text-[#0a0a0a]"
          }`}
        >
          {state === "submitting" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          ) : (
            <ArrowLeft size={16} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {error ? (
        <p className="mt-2 text-xs font-light text-[#e7a89a]">{error}</p>
      ) : (
        <p
          className={`mt-2.5 inline-flex items-center gap-1 text-[11px] font-light ${
            dark ? "text-platinum/50" : "text-ash"
          }`}
        >
          <Sparkles size={12} strokeWidth={1.5} className="text-gold" />
          קבלי 10% הנחה מיידית על ההזמנה — הקוד מופעל אוטומטית.
        </p>
      )}
    </form>
  );
}
