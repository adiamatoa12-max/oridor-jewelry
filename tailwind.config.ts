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
        // Dark-luxury palette — deep charcoal surfaces, soft-white type, gold.
        // Surfaces (was light → now dark)
        canvas: "#141414",        // card / nav / raised surface
        offwhite: "#0A0A0A",      // global page base (deep charcoal)
        sand: "#161616",          // subtle section band
        cream: "#141414",         // raised dark surface
        beige: "#1A1A1A",         // soft dark panel
        pearl: "#141414",         // dark neutral surface
        mist: "#1A1A1A",          // section wash
        cloud: "#242424",         // slightly lighter dark
        // Accents / borders
        platinum: "#333333",      // subtle hairline / border on dark
        silver: "#9A9A9A",        // silver accent
        gold: "#C9A45C",          // warm metallic gold — primary accent
        // Typography (was dark → now soft white on dark)
        charcoal: "#E0E0E0",      // primary text — soft white
        graphite: "#B4B4B4",      // secondary body text
        ash: "#8A8A8A",           // muted / captions
      },
      fontFamily: {
        sans: ["var(--font-assistant)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "ui-serif", "Georgia", "serif"],
        // Editorial display serif (Hebrew-complete) — luxury headings.
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
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
