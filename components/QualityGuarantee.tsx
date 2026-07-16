// Oridor's premium quality promise, shown as a "quality stamp" under the CTA.
// Bolded Hebrew labels anchor each guarantee; text-only to match the boutique,
// minimalist aesthetic (no icons, no boxes — just a quiet hairline).
const POINTS = [
  { label: "חומרים", text: "כסף 925 אמיתי עם תעודת איכות לכל תכשיט." },
  { label: "עמידות", text: "ציפוי רודיום יוקרתי – התכשיט שנשמר הכי טוב לאורך זמן." },
  { label: "בטיחות", text: "היפואלרגני – מתאים לעור רגיש ללא חשש." },
  { label: "אחריות", text: "הסטנדרט של Oridor – איכות ללא פשרות." },
];

/**
 * "Quality Guarantee" stamp — placed directly under the Add-to-Cart button,
 * where buyers seek reassurance before purchasing.
 */
export default function QualityGuarantee() {
  return (
    <div className="mt-9 border-t border-platinum/40 pt-8">
      <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-gold">
        אחריות איכות
      </p>
      <dl className="space-y-3">
        {POINTS.map((p) => (
          <div key={p.label} className="text-[13px] leading-relaxed">
            <dt className="inline font-semibold text-charcoal">{p.label}: </dt>
            <dd className="inline font-light text-graphite">{p.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
