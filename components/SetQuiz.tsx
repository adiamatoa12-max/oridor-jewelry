"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  q: string;
  options: { label: string; value: string }[];
}

const QUESTIONS: Question[] = [
  {
    q: "איזה סגנון מדבר אלייך?",
    options: [
      { label: "קלאסי ועדין", value: "classic" },
      { label: "נועז ובולט", value: "bold" },
      { label: "רומנטי ונשי", value: "romantic" },
    ],
  },
  {
    q: "לאיזה רגע?",
    options: [
      { label: "ליום-יום", value: "daily" },
      { label: "לערב מיוחד", value: "evening" },
      { label: "כמתנה", value: "gift" },
    ],
  },
  {
    q: "מה הכי מושך אותך?",
    options: [
      { label: "שרשראות", value: "Necklaces" },
      { label: "טבעות", value: "Rings" },
      { label: "עגילים", value: "Earrings" },
      { label: "צמידים", value: "Bracelets" },
    ],
  },
];

const RESULTS: Record<string, string> = {
  Necklaces: "סט השרשראות שלך מחכה — עדין, נוצץ ועל-זמני.",
  Rings: "סט הטבעות שלך מחכה — ברק שמלווה אותך בכל תנועה.",
  Earrings: "סט העגילים שלך מחכה — נצנוץ עדין למסגרת הפנים.",
  Bracelets: "סט הצמידים שלך מחכה — אלגנטיות על פרק כף היד.",
};

/**
 * "Find your signature set in 3 clicks" — a small, elegant homepage quiz that
 * recommends a collection based on three quick choices.
 */
export default function SetQuiz() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (value: string) => {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setPicked(value);
    }
  };

  const reset = () => {
    setStep(0);
    setPicked(null);
  };

  return (
    <section className="px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-2xl rounded-md border border-gold/30 bg-canvas/70 px-8 py-14 text-center shadow-card backdrop-blur-sm sm:px-14">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">קוויז קצר</p>
        <h2 className="text-2xl font-light leading-relaxed tracking-widest text-charcoal lg:text-3xl">
          מצאי את הסט שלך ב-3 קליקים
        </h2>
        <span className="mx-auto my-8 block h-px w-16 bg-gold" />

        {picked ? (
          <div>
            <p className="text-base font-light leading-relaxed text-charcoal">
              {RESULTS[picked]}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/collection/moissanite" className="btn-primary">
                לגילוי הסט
              </Link>
              <button
                type="button"
                onClick={reset}
                className="text-xs tracking-wide text-graphite underline underline-offset-4 transition-colors hover:text-gold"
              >
                התחילי מחדש
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Progress dots */}
            <div className="mb-8 flex justify-center gap-2">
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === step ? "w-8 bg-gold" : "w-1.5 bg-gold/30"
                  }`}
                />
              ))}
            </div>

            <p className="mb-8 text-lg font-light tracking-wide text-charcoal">
              {QUESTIONS[step].q}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {QUESTIONS[step].options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => choose(o.value)}
                  className="min-h-[44px] border border-charcoal/30 px-6 py-2.5 text-sm font-light tracking-wide text-charcoal transition-all duration-500 ease-cinematic hover:border-gold hover:bg-gold/10 hover:text-charcoal"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
