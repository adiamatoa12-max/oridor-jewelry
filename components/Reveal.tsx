"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll wrapper.
 * Children start slightly faded + shifted down, then glide up into place when
 * scrolled into view. Fail-safe: content is never left permanently hidden —
 * elements already in/near the viewport reveal immediately, IntersectionObserver
 * handles the rest, and a timeout fallback guarantees visibility. Respects
 * prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Already in or just below the viewport on mount → reveal right away.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    // Safety net: never leave content hidden, even if the observer misfires.
    const fallback = window.setTimeout(() => setVisible(true), 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-[1100ms] ease-cinematic ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
