"use client";

/**
 * Detailed 2D "3D-feel" gift renderings for the VIP Vault robot.
 * Pure inline SVG — zero network weight, mounted lazily only when a gift is
 * selected. Each item carries micro light reflections (specular highlights,
 * glass gradients) and sits on a tiny mirrored pedestal for depth.
 */

function Pedestal({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col items-center">
      {children}
      {/* Mirrored reflection + depth-of-field blur under the item */}
      <div className="pointer-events-none -mt-1 h-3 w-16 rounded-[50%] bg-white/70 blur-[6px]" />
      <div className="pointer-events-none -mt-2 h-1.5 w-10 rounded-[50%] bg-charcoal/10 blur-[3px]" />
    </div>
  );
}

/** Open white leather travel box, micro logo, moissanite pieces inside. */
export function TravelBoxItem() {
  return (
    <Pedestal>
      <svg width="84" height="64" viewBox="0 0 84 64" aria-hidden="true">
        <defs>
          <linearGradient id="tb-lid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#EDEAE3" />
          </linearGradient>
          <linearGradient id="tb-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F7F4EE" />
            <stop offset="1" stopColor="#DDD8CE" />
          </linearGradient>
          <radialGradient id="tb-gem" cx="0.35" cy="0.3" r="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#DCE7F5" />
            <stop offset="1" stopColor="#9FB4D0" />
          </radialGradient>
        </defs>
        {/* Open lid */}
        <path d="M12 26 L42 18 L72 26 L42 33 Z" fill="url(#tb-lid)" stroke="#CFC9BD" strokeWidth="0.6" />
        {/* Lid inner satin */}
        <path d="M16 26.5 L42 20.5 L68 26.5 L42 31 Z" fill="#FBFAF7" />
        {/* Micro-etched logo on lid */}
        <text x="42" y="27.4" textAnchor="middle" fontSize="3.1" letterSpacing="1.1" fill="#B9A15E" fontFamily="serif">ORIDOR</text>
        {/* Base */}
        <path d="M14 33 L70 33 L66 52 Q42 57 18 52 Z" fill="url(#tb-base)" stroke="#CFC9BD" strokeWidth="0.6" />
        {/* Slots */}
        <rect x="22" y="36" width="40" height="11" rx="2" fill="#F1EDE5" />
        <line x1="35" y1="36" x2="35" y2="47" stroke="#DDD6C9" strokeWidth="0.8" />
        <line x1="49" y1="36" x2="49" y2="47" stroke="#DDD6C9" strokeWidth="0.8" />
        {/* Moissanite ring */}
        <circle cx="28.5" cy="42" r="3.6" fill="none" stroke="#C9CCD1" strokeWidth="1.4" />
        <circle cx="28.5" cy="38.6" r="1.7" fill="url(#tb-gem)" />
        {/* Moissanite pendant */}
        <line x1="42" y1="37" x2="42" y2="41" stroke="#C0C4CA" strokeWidth="0.7" />
        <circle cx="42" cy="42.6" r="2" fill="url(#tb-gem)" />
        {/* Studs pair */}
        <circle cx="55.5" cy="40.5" r="1.6" fill="url(#tb-gem)" />
        <circle cx="58.8" cy="43.6" r="1.6" fill="url(#tb-gem)" />
        {/* Micro specular sparkles */}
        <path d="M28.5 36.4 l0.5 1 l1 0.5 l-1 0.5 l-0.5 1 l-0.5 -1 l-1 -0.5 l1 -0.5 Z" fill="#FFFFFF" />
        <circle cx="43" cy="41.8" r="0.45" fill="#FFFFFF" />
        <circle cx="56.2" cy="39.9" r="0.4" fill="#FFFFFF" />
      </svg>
    </Pedestal>
  );
}

/** Classic silver stud earrings on a miniature display stand. */
export function EarringsItem() {
  return (
    <Pedestal>
      <svg width="72" height="64" viewBox="0 0 72 64" aria-hidden="true">
        <defs>
          <radialGradient id="er-gem" cx="0.35" cy="0.3" r="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.45" stopColor="#E8F0FA" />
            <stop offset="1" stopColor="#9FB4D0" />
          </radialGradient>
          <linearGradient id="er-stand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FDFCFA" />
            <stop offset="1" stopColor="#E3DFD6" />
          </linearGradient>
        </defs>
        {/* Miniature display stand */}
        <path d="M18 22 Q36 14 54 22 L50 44 Q36 49 22 44 Z" fill="url(#er-stand)" stroke="#D5CFC2" strokeWidth="0.6" />
        <ellipse cx="36" cy="50" rx="18" ry="3.4" fill="#EFEBE2" />
        {/* Left stud — halo setting */}
        <circle cx="28" cy="30" r="5.2" fill="none" stroke="#C9CCD1" strokeWidth="1.6" />
        <circle cx="28" cy="30" r="3.1" fill="url(#er-gem)" />
        {/* Right stud */}
        <circle cx="44" cy="30" r="5.2" fill="none" stroke="#C9CCD1" strokeWidth="1.6" />
        <circle cx="44" cy="30" r="3.1" fill="url(#er-gem)" />
        {/* Facet lines */}
        <path d="M26.6 28.6 L29.4 31.4 M29.4 28.6 L26.6 31.4" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.9" />
        <path d="M42.6 28.6 L45.4 31.4 M45.4 28.6 L42.6 31.4" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.9" />
        {/* Sparkles */}
        <path d="M28 23.6 l0.6 1.2 l1.2 0.6 l-1.2 0.6 l-0.6 1.2 l-0.6 -1.2 l-1.2 -0.6 l1.2 -0.6 Z" fill="#FFFFFF" />
        <circle cx="46.8" cy="26.4" r="0.5" fill="#FFFFFF" />
      </svg>
    </Pedestal>
  );
}

/** Jewelry care kit — polishing bottle, cloth and brush. */
export function CareKitItem() {
  return (
    <Pedestal>
      <svg width="80" height="64" viewBox="0 0 80 64" aria-hidden="true">
        <defs>
          <linearGradient id="ck-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#F4F6F8" />
            <stop offset="0.5" stopColor="#DDE4EA" />
            <stop offset="1" stopColor="#C3CCD6" />
          </linearGradient>
          <linearGradient id="ck-cloth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F8F5EF" />
            <stop offset="1" stopColor="#E4DECF" />
          </linearGradient>
        </defs>
        {/* Polishing bottle */}
        <rect x="20" y="22" width="13" height="26" rx="3" fill="url(#ck-glass)" stroke="#B9C2CC" strokeWidth="0.7" />
        <rect x="23.4" y="16" width="6.2" height="7" rx="1.4" fill="#54565B" />
        <rect x="21.8" y="30" width="9.4" height="10" rx="1.2" fill="#FFFFFF" />
        <text x="26.5" y="36.6" textAnchor="middle" fontSize="2.6" letterSpacing="0.6" fill="#B9A15E" fontFamily="serif">ORIDOR</text>
        {/* Glass specular stripe */}
        <rect x="22" y="23" width="1.6" height="23" rx="0.8" fill="#FFFFFF" opacity="0.85" />
        {/* Folded cloth */}
        <path d="M38 40 Q50 33 62 40 L60 50 Q49 55 40 50 Z" fill="url(#ck-cloth)" stroke="#D8D1C0" strokeWidth="0.6" />
        <path d="M40 43 Q50 38 60 43" stroke="#D8D1C0" strokeWidth="0.6" fill="none" />
        {/* Brush */}
        <rect x="52" y="20" width="16" height="4.6" rx="2.3" transform="rotate(24 52 20)" fill="#C5A059" />
        <path d="M50.5 22.5 l-4.5 2.6 q-1.6 1 -0.4 2.4 l1 1 q4 -0.6 5.6 -3.4 Z" fill="#8A8D93" />
        {/* Sparkle */}
        <path d="M36 20 l0.6 1.2 l1.2 0.6 l-1.2 0.6 l-0.6 1.2 l-0.6 -1.2 l-1.2 -0.6 l1.2 -0.6 Z" fill="#FFFFFF" />
      </svg>
    </Pedestal>
  );
}

/** Empty presentation surface — default state before a gift is chosen. */
export function EmptyTrayItem() {
  return (
    <Pedestal>
      <svg width="72" height="40" viewBox="0 0 72 40" aria-hidden="true">
        <defs>
          <linearGradient id="tray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FDFCFA" />
            <stop offset="1" stopColor="#E7E2D8" />
          </linearGradient>
        </defs>
        <ellipse cx="36" cy="22" rx="26" ry="8.5" fill="url(#tray)" stroke="#D8D2C5" strokeWidth="0.7" />
        <ellipse cx="36" cy="20.6" rx="21" ry="6" fill="#F6F3EC" />
        <text x="36" y="22.6" textAnchor="middle" fontSize="3.4" letterSpacing="1.4" fill="#C9CCD1" fontFamily="serif">ORIDOR</text>
      </svg>
    </Pedestal>
  );
}
