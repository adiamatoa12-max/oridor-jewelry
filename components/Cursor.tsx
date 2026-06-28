"use client";

import { useEffect, useState } from "react";

/**
 * Custom luxury cursor — a tiny gold dot that expands into an elegant ring
 * when hovering clickable elements. Only active on fine-pointer (mouse)
 * devices; touch devices keep their native behavior.
 */
export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    setActive(true);
    document.body.classList.add("cursor-none");

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest("a, button, [role='button'], input, select, label"));
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("cursor-none");
    };
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:block"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      <span
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out ${
          hovering
            ? "h-8 w-8 border border-gold bg-transparent"
            : "h-2 w-2 border border-transparent bg-gold"
        }`}
      />
    </div>
  );
}
