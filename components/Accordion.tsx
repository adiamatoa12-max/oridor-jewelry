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
    <div className="divide-y divide-platinum/50 overflow-hidden rounded-xl border border-platinum/50 bg-cream/30 px-5">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-5 text-start text-sm font-medium tracking-wide text-charcoal transition-colors hover:text-gold"
            >
              {item.title}
              <span
                className={`ms-4 text-lg font-light text-ash transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
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
                <div className="pb-6 text-sm font-light leading-relaxed text-graphite">
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
