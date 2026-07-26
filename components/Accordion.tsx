"use client";

import { useState } from "react";

export interface AccordionItem {
  title: string;
  /** Plain text or ready-made JSX. */
  content: React.ReactNode;
}

/**
 * Minimalist collapsible accordion for PDP details.
 * Hairline dividers, a rotating +/× affordance, and a smooth height reveal.
 * The first item can be open by default via `defaultOpen`.
 */
export default function Accordion({
  items,
  defaultOpen = -1,
}: {
  items: AccordionItem[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="divide-y divide-platinum/50 overflow-hidden rounded-2xl border border-platinum/50 bg-cream/30 px-5 antialiased sm:px-6">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between py-5 text-start text-[15px] font-semibold tracking-wide transition-colors hover:text-gold sm:text-base ${
                isOpen ? "text-gold" : "text-charcoal"
              }`}
            >
              {item.title}
              <span
                className={`ms-4 flex h-6 w-6 flex-none items-center justify-center text-xl font-light transition-transform duration-300 ${
                  isOpen ? "rotate-45 text-gold" : "text-ash"
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-7 text-[15px] font-light leading-[1.8] text-graphite sm:text-sm">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
