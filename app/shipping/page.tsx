import type { Metadata } from "next";
import { Truck, MapPin } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "משלוחים והחזרות",
  description: "מדיניות המשלוחים של Oridor — משלוח מהיר עד הבית ואיסוף מנקודות, עם מעקב מלא.",
};

const OPTIONS = [
  {
    icon: Truck,
    title: "משלוח מהיר עד הבית",
    time: "3–5 ימי עסקים",
    note: "משלוח חינם בהזמנות מעל ₪299. בהזמנות מתחת לסכום זה, עלות המשלוח היא ₪30.",
  },
  {
    icon: MapPin,
    title: "משלוח לנקודת איסוף",
    time: "4–7 ימי עסקים",
    note: "בעלות של ₪15.",
  },
];

export default function ShippingPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10 lg:py-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">שירות ללא פשרות</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          מדיניות משלוחים
        </h1>
        <span className="mx-auto my-8 block h-px w-16 bg-gold" />
        <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-graphite">
          אנו יודעים כמה את מחכה לתכשיט החדש שלך, ולכן אנו עושים הכל כדי שיגיע
          אלייך במהירות ובבטחה.
        </p>
      </section>

      {/* Processing & tracking */}
      <section className="mx-auto max-w-3xl px-6 sm:px-10">
        <div>
          <h2 className="text-lg font-normal tracking-wide text-charcoal">
            זמן עיבוד ומעקב
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
            זמן עיבוד והכנת ההזמנה אורך בדרך כלל בין 1–2 ימי עסקים. ברגע שהחבילה
            שלך תצא לדרך, נשלח אלייך מספר מעקב במייל או ב-SMS כדי שתוכלי לעקוב
            אחריה.
          </p>
        </div>
      </section>

      {/* Shipping options */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:py-20">
        <h2 className="mb-8 text-center text-lg font-normal tracking-wide text-charcoal">
          אפשרויות המשלוח שלנו
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {OPTIONS.map((o) => (
            <div
              key={o.title}
              className="flex flex-col items-center rounded-sm border border-platinum/40 bg-cream/40 p-10 text-center"
            >
              <o.icon size={26} strokeWidth={1.25} className="text-gold" />
              <h3 className="mt-5 text-lg font-light tracking-wide text-charcoal">
                {o.title}
              </h3>
              <p className="mt-2 text-xs tracking-[0.2em] text-gold">{o.time}</p>
              <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
                {o.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
