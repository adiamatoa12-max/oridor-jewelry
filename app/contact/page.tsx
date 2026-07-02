import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, Clock } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "צור קשר",
  description: "נשמח לעמוד לרשותך — צרי קשר עם צוות Oridor בכל שאלה או בקשה.",
};

const DETAILS = [
  { icon: Mail, label: "אימייל", value: "hello@oridor.co.il", href: "mailto:hello@oridor.co.il" },
  { icon: Phone, label: "טלפון", value: "052-818-1568", href: "tel:0528181568" },
  {
    icon: MessageCircle,
    label: "וואטסאפ",
    value: "שלחי לנו הודעה",
    href: "https://wa.me/972528181568",
  },
  { icon: Clock, label: "שעות פעילות", value: "א׳–ה׳, 09:00–18:00" },
];

const inputClass =
  "w-full border border-platinum/60 bg-canvas px-4 py-3 text-sm font-light text-charcoal transition-colors placeholder:text-ash focus:border-gold focus:outline-none";

export default function ContactPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10 lg:py-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">נשמח לשמוע ממך</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          צור קשר
        </h1>
        <span className="mx-auto my-8 block h-px w-16 bg-gold" />
        <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-graphite">
          יש לך שאלה על פריט, הזמנה או התאמה אישית? צוות Oridor כאן בשבילך. מלאי
          את הפרטים ונחזור אלייך בהקדם.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Contact details */}
          <div className="space-y-8">
            {DETAILS.map((d) => {
              const content = (
                <div className="flex items-start gap-4">
                  <d.icon size={20} strokeWidth={1.25} className="mt-0.5 flex-none text-gold" />
                  <div>
                    <p className="text-xs tracking-[0.2em] text-ash">{d.label}</p>
                    <p className="mt-1 text-sm font-light text-charcoal">{d.value}</p>
                  </div>
                </div>
              );
              return d.href ? (
                <a key={d.label} href={d.href} className="block transition-opacity hover:opacity-70">
                  {content}
                </a>
              ) : (
                <div key={d.label}>{content}</div>
              );
            })}
          </div>

          {/* Contact form (presentational placeholder) */}
          <form className="space-y-4">
            <input type="text" placeholder="שם מלא" aria-label="שם מלא" className={inputClass} />
            <input type="email" placeholder="כתובת אימייל" aria-label="כתובת אימייל" className={inputClass} />
            <input type="tel" placeholder="טלפון" aria-label="טלפון" className={inputClass} />
            <textarea rows={5} placeholder="ההודעה שלך" aria-label="ההודעה שלך" className={inputClass} />
            <button type="button" className="btn-primary w-full">
              שליחת הודעה
            </button>
          </form>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
