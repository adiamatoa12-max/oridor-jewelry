"use client";

import { Mail, Phone, MessageCircle, Clock } from "lucide-react";
import { trackPixel } from "@/lib/metaPixel";

const DETAILS = [
  { icon: Mail, label: "אימייל", value: "Oridorjewelry4@gmail.com", href: "mailto:Oridorjewelry4@gmail.com" },
  { icon: Phone, label: "טלפון", value: "051-5518689", href: "tel:0515518689" },
  {
    icon: MessageCircle,
    label: "וואטסאפ",
    value: "שלחי לנו הודעה",
    href: "https://wa.me/972515518689",
  },
  { icon: Clock, label: "שעות פעילות", value: "א׳–ה׳, 09:00–18:00", href: undefined },
];

/**
 * Contact-detail list. Split into its own client component so the page stays a
 * server component: the only thing that needs the client is firing the Meta
 * Pixel Contact event when the shopper actually initiates contact (taps email,
 * phone or WhatsApp). The office-hours row has no href and isn't an action.
 */
export default function ContactDetails() {
  return (
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
          <a
            key={d.label}
            href={d.href}
            onClick={() => trackPixel("Contact")}
            className="block transition-opacity hover:opacity-70"
          >
            {content}
          </a>
        ) : (
          <div key={d.label}>{content}</div>
        );
      })}
    </div>
  );
}
