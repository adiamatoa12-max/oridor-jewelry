import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ContactDetails from "@/components/ContactDetails";

export const metadata: Metadata = {
  title: "צור קשר",
  description: "נשמח לעמוד לרשותך. צרי קשר עם צוות Oridor בכל שאלה על פריט, על הזמנה קיימת או על התאמה אישית, ונחזור אלייך בהקדם האפשרי.",
};

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
          יש לך שאלה על פריט, על הזמנה קיימת או על התאמה אישית? צוות Oridor כאן בשבילך. מלאי את הפרטים ונחזור אלייך בהקדם.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Contact details */}
          <ContactDetails />

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
