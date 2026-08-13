"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Check, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCart } from "./CartContext";
import { isEmail, normalizeIsraeliPhone } from "@/lib/phone";

/**
 * The club welcome discount code. It must exist in Shopify (Discounts → a code
 * discount, 10% off, e.g. "WELCOME10"). Set NEXT_PUBLIC_CLUB_WELCOME_CODE to
 * match your code; the app applies it to the shopper's cart on sign-up so the
 * 10% is live for the session and carries to checkout.
 */
const WELCOME_CODE = process.env.NEXT_PUBLIC_CLUB_WELCOME_CODE || "WELCOME10";

const RESEND_COOLDOWN_S = 60;

/**
 * VIP / loyalty club sign-up. On submit it captures the lead (as a Shopify
 * customer, via /api/lead) and activates a 10% welcome discount on the session's
 * cart, then shows a clear welcome + confirmation. Tone-aware so it drops into a
 * light section or the dark footer.
 *
 * When `verifyPhone` is set (the homepage popup), it additionally collects a
 * phone number and requires an SMS one-time-code (Twilio Verify) BEFORE the
 * discount is granted — blocking fake-email/spam signups. If the SMS provider
 * isn't configured yet, it transparently falls back to the email-only flow so
 * the popup never breaks.
 */
export default function ClubSignup({
  tone = "light",
  layout = "inline",
  ctaLabel = "הצטרפי וקבלי 10% הנחה",
  verifyPhone = false,
  onSuccess,
}: {
  tone?: "light" | "dark";
  /** "inline" = underline field + round arrow (footer/section); "stacked" =
   *  boxed field above a prominent full-width gold button (popup). */
  layout?: "inline" | "stacked";
  /** Label for the prominent button in the "stacked" layout. */
  ctaLabel?: string;
  /** Require an SMS-verified phone (in addition to email) before granting the
   *  discount. Only honoured in the "stacked" layout. */
  verifyPhone?: boolean;
  /** Fired once the shopper has successfully joined (e.g. so a host popup can
   *  mark itself dismissed). */
  onSuccess?: () => void;
}) {
  const { applyDiscount } = useCart();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"details" | "verify" | "done">("details");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const dark = tone === "dark";
  const usePhoneFlow = verifyPhone && layout === "stacked";

  // Resend cooldown ticker.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setInterval(() => setResendIn((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [resendIn]);

  /** Save the lead + activate the discount + show the welcome state. */
  const finishJoin = async (phoneVerified: boolean) => {
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim() || undefined,
          source: "vip-club",
          phoneVerified,
        }),
      });
    } catch {
      /* capture is best-effort — never block joining on a network hiccup */
    }
    applyDiscount(WELCOME_CODE);
    setPhase("done");
    onSuccess?.();
  };

  /* -------- Email-only submit (footer inline + stacked when not verifying) -------- */
  const submitEmailOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!isEmail(email)) {
      setError("נא להזין כתובת אימייל תקינה");
      return;
    }
    setBusy(true);
    setError(null);
    await finishJoin(false);
    setBusy(false);
  };

  /* -------- Step 1 (phone flow): send the SMS code -------- */
  const sendCode = async (isResend = false) => {
    if (busy) return;
    if (!isEmail(email)) {
      setError("נא להזין כתובת אימייל תקינה");
      return;
    }
    if (!normalizeIsraeliPhone(phone)) {
      setError("נא להזין מספר טלפון נייד תקין");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        configured?: boolean;
        error?: string;
      };

      // Provider not set up yet → transparently fall back to email-only join.
      if (data.configured === false) {
        await finishJoin(false);
        return;
      }
      if (res.ok && data.ok) {
        setPhase("verify");
        setCode("");
        setResendIn(RESEND_COOLDOWN_S);
        return;
      }
      if (res.status === 429) {
        setError("נשלחו יותר מדי בקשות. נסי שוב בעוד רגע.");
      } else if (data.error === "invalid_phone") {
        setError("מספר הטלפון אינו תקין.");
      } else {
        setError("שליחת הקוד נכשלה. נסי שוב.");
      }
    } catch {
      setError("שליחת הקוד נכשלה. בדקי את החיבור ונסי שוב.");
    } finally {
      setBusy(false);
      if (isResend) setResendIn(RESEND_COOLDOWN_S);
    }
  };

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    void sendCode(false);
  };

  /* -------- Step 2 (phone flow): verify the code, then join -------- */
  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const clean = code.replace(/\D/g, "");
    if (clean.length < 4) {
      setError("נא להזין את הקוד שקיבלת ב-SMS");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: clean }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; approved?: boolean; error?: string };

      if (res.ok && data.ok && data.approved) {
        await finishJoin(true);
        return;
      }
      if (data.error === "too_many_attempts") {
        setError("יותר מדי ניסיונות. שלחי קוד חדש.");
      } else if (data.error === "expired") {
        setError("הקוד פג תוקף. שלחי קוד חדש.");
      } else if (res.ok && data.ok && !data.approved) {
        setError("הקוד שגוי. נסי שוב.");
      } else {
        setError("האימות נכשל. נסי שוב.");
      }
    } catch {
      setError("האימות נכשל. בדקי את החיבור ונסי שוב.");
    } finally {
      setBusy(false);
    }
  };

  /* -------- Shared field styling -------- */
  const fieldClass = `w-full rounded-full border px-5 py-3.5 text-center text-[15px] tracking-wide backdrop-blur-sm transition-all duration-300 focus:outline-none ${
    dark
      ? "border-white/25 bg-black/35 text-white placeholder:text-white/55 focus:border-gold/70 focus:bg-black/45 focus:shadow-[0_0_0_4px_rgba(198,161,92,0.18)]"
      : "border-charcoal/15 bg-canvas text-charcoal placeholder:text-ash focus:border-gold/60 focus:shadow-[0_0_0_4px_rgba(198,161,92,0.14)]"
  }`;

  const goldButtonClass =
    "btn-gold group w-full rounded-full shadow-[0_10px_28px_-12px_rgba(198,161,92,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(198,161,92,0.85)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0";

  /* -------- Success / onboarding state -------- */
  if (phase === "done") {
    return (
      <div
        className={`flex items-start gap-3 rounded-xl p-4 ${
          dark ? "bg-gold/10 ring-1 ring-gold/25" : "bg-emerald-50 ring-1 ring-emerald-600/15"
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
          <p className={`text-sm font-semibold ${dark ? "text-cream" : "text-emerald-800"}`}>
            ברוכה הבאה למועדון ה-VIP! 🎉
          </p>
          <p
            className={`mt-1 text-[13px] font-light leading-relaxed ${
              dark ? "text-platinum/70" : "text-emerald-700"
            }`}
          >
            הנחת 10% הופעלה לך אוטומטית וכבר מחכה בעגלה. הקוד שלך:{" "}
            <span className={`font-semibold tracking-wide ${dark ? "text-gold" : "text-emerald-800"}`}>
              {WELCOME_CODE}
            </span>
          </p>
        </div>
      </div>
    );
  }

  /* -------- Phone flow, step 2: enter the SMS code -------- */
  if (usePhoneFlow && phase === "verify") {
    return (
      <form onSubmit={submitCode} noValidate className="w-full">
        <p className={`mb-3 text-[13px] font-light ${dark ? "text-white/80" : "text-graphite"}`}>
          שלחנו קוד אימות ב-SMS למספר{" "}
          <span className="font-semibold" dir="ltr">
            {phone.trim()}
          </span>
        </p>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          dir="ltr"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            if (error) setError(null);
          }}
          placeholder="- - - - - -"
          aria-label="קוד אימות מה-SMS"
          aria-invalid={Boolean(error)}
          maxLength={6}
          className={`${fieldClass} tracking-[0.5em]`}
        />

        {error && <p className="mt-2 text-center text-xs font-light text-[#e7a89a]">{error}</p>}

        <button type="submit" disabled={busy} className={`mt-3.5 ${goldButtonClass}`}>
          {busy ? (
            "רק רגע…"
          ) : (
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} strokeWidth={2} />
              אימות וקבלת ההנחה
            </span>
          )}
        </button>

        <div className="mt-3 flex items-center justify-between text-[12px]">
          <button
            type="button"
            onClick={() => {
              setPhase("details");
              setCode("");
              setError(null);
            }}
            className={`font-light underline-offset-4 hover:underline ${
              dark ? "text-white/60 hover:text-white" : "text-ash hover:text-charcoal"
            }`}
          >
            ‹ שינוי פרטים
          </button>
          <button
            type="button"
            disabled={busy || resendIn > 0}
            onClick={() => void sendCode(true)}
            className={`font-light underline-offset-4 enabled:hover:underline disabled:opacity-50 ${
              dark ? "text-gold" : "text-gold"
            }`}
          >
            {resendIn > 0 ? `שליחת קוד מחדש (${resendIn})` : "שליחת קוד מחדש"}
          </button>
        </div>
      </form>
    );
  }

  /* -------- Stacked layout: boxed field(s) + prominent gold button (popup) -------- */
  if (layout === "stacked") {
    const onSubmit = usePhoneFlow ? submitDetails : submitEmailOnly;
    return (
      <form onSubmit={onSubmit} noValidate className="w-full">
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
          className={fieldClass}
        />

        {usePhoneFlow && (
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (error) setError(null);
            }}
            placeholder="מספר טלפון נייד"
            aria-label="מספר טלפון נייד לאימות"
            aria-invalid={Boolean(error)}
            className={`${fieldClass} mt-3 placeholder:tracking-normal`}
          />
        )}

        {error && <p className="mt-2 text-center text-xs font-light text-[#e7a89a]">{error}</p>}

        <button type="submit" disabled={busy} className={`mt-3.5 ${goldButtonClass}`}>
          {busy ? (
            "רק רגע…"
          ) : (
            <span className="inline-flex items-center gap-2">
              <Sparkles
                size={15}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              />
              {usePhoneFlow ? "שליחת קוד אימות" : ctaLabel}
            </span>
          )}
        </button>

        {usePhoneFlow && (
          <p
            className={`mt-3 inline-flex w-full items-center justify-center gap-1 text-[11px] font-light ${
              dark ? "text-white/50" : "text-ash"
            }`}
          >
            <ShieldCheck size={12} strokeWidth={1.5} className="text-gold" />
            אימות מהיר ב-SMS — כדי לוודא שההטבה מגיעה אלייך בלבד.
          </p>
        )}
      </form>
    );
  }

  /* -------- Inline layout: underline field + round arrow (footer/section) -------- */
  return (
    <form onSubmit={submitEmailOnly} noValidate className="w-full">
      <div
        className={`group flex items-center gap-2 border-b pb-2.5 transition-colors ${
          dark ? "border-white/20 focus-within:border-gold" : "border-charcoal/20 focus-within:border-gold"
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
            dark ? "text-cream placeholder:text-platinum/40" : "text-charcoal placeholder:text-ash"
          }`}
        />
        <button
          type="submit"
          disabled={busy}
          aria-label="הצטרפות למועדון"
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-60 ${
            dark
              ? "border-gold/50 text-gold hover:bg-gold hover:text-ink"
              : "border-gold/50 text-gold hover:bg-gold hover:text-[#0a0a0a]"
          }`}
        >
          {busy ? (
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
