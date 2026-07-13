// The brand's core assurances, consolidated. Deliberately text-only — no
// icons, no boxes — presented as quiet label/value pairs so the section reads
// like a luxury brand's description rather than an e-commerce features grid.
const PAIRS = [
  { label: "אותנטיות", value: "תעודת GRA מקורית לכל תכשיט" },
  { label: "אחריות", value: "אחריות מלאה לכל החיים" },
  { label: "החומר", value: "כסף 925 טהור בציפוי רודיום" },
  { label: "משלוח והחזרות", value: "משלוח חינם · החזרות עד 14 יום" },
];

/**
 * Minimalist trust section — a refined set of label/value pairs with generous
 * whitespace, separated from the buy actions above only by a thin hairline.
 * Sophisticated typography carries it; nothing else competes for attention.
 */
export default function QualityTrust() {
  return (
    <div className="mt-10 border-t border-platinum/40 pt-8">
      <dl className="grid grid-cols-1 gap-x-12 gap-y-7 sm:grid-cols-2">
        {PAIRS.map((p) => (
          <div key={p.label}>
            <dt className="text-[10px] uppercase tracking-[0.28em] text-gold">
              {p.label}
            </dt>
            <dd className="mt-2 text-[13px] font-light leading-relaxed text-graphite">
              {p.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
