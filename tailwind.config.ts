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
        // Boutique-luxury palette — warm off-white surfaces, deep charcoal type,
        // gold accent. Deep #0A0A0A is reserved for highlight blocks only.
        // Surfaces (bright & warm)
        canvas: "#FFFFFF",        // crisp white card / nav / raised surface
        offwhite: "#FAF9F6",      // global page base — soft warm off-white
        sand: "#F2EEE7",          // subtle warm section band
        cream: "#FAF7F0",         // warm cream surface
        beige: "#F5F1E8",         // soft beige panel
        pearl: "#F4F3F1",         // pearl-neutral surface
        mist: "#EFEDE9",          // warm section wash
        cloud: "#E7E3DC",         // slightly deeper warm neutral
        // Highlight / accents
        ink: "#0A0A0A",           // deep charcoal — highlight blocks only
        platinum: "#DAD5CC",      // soft warm hairline / border
        silver: "#AFB4BB",        // silver accent
        gold: "#C5A059",          // warm luxury gold — primary accent
        // Typography (deep, sophisticated charcoal — not pure black)
        charcoal: "#1A1A1A",      // primary text — deep charcoal
        graphite: "#4A4A4A",      // secondary body text
        ash: "#6B6B6B",           // muted / captions
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
