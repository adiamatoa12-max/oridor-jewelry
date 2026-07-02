import type { Config } from "tailwindcss";

/**
 * Oridor Jewelry design system.
 * Palette: crisp whites, soft pearl grays, light platinum/silver accents.
 * Typography: deep charcoal / graphite — NEVER pure black, NEVER gold.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds & surfaces — warm boutique palette
        canvas: "#FFFFFF",        // crisp white (cards)
        cream: "#FAF7F0",         // warm cream base
        beige: "#F5F1E8",         // soft beige (warm surface)
        pearl: "#F4F3F1",         // soft pearl gray (warm-neutral)
        mist: "#ECEDEF",          // light grey hero/section wash
        cloud: "#E3E5E8",         // slightly deeper pearl
        // Accents
        platinum: "#C9CCD1",      // light platinum/silver
        silver: "#AFB4BB",        // silver accent for hairlines/hover
        gold: "#C5A059",          // warm luxury gold — accent
        // Typography (deep warm charcoal, high contrast — not pure black)
        charcoal: "#2B2C2F",      // primary text — deep charcoal
        graphite: "#3F4145",      // secondary body text (high contrast)
        ash: "#45474D",           // muted / captions (still strong contrast)
      },
      fontFamily: {
        sans: ["var(--font-assistant)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "ui-serif", "Georgia", "serif"],
      },
      letterSpacing: {
        brand: "0.35em",
        wide: "0.18em",
      },
      boxShadow: {
        card: "0 12px 40px -24px rgba(43, 44, 47, 0.18)",
        cardHover: "0 30px 70px -30px rgba(43, 44, 47, 0.28)",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "soft-ping": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "75%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "soft-float": {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(-6px)", opacity: "0.85" },
        },
      },
      animation: {
        // Cinematic ease, starts hidden (fill: both) for clean staggering
        "fade-up": "fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 28s linear infinite",
        "soft-ping": "soft-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "soft-float": "soft-float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
