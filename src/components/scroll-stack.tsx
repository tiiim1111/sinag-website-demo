"use client";

import { useEffect, useRef, useState } from "react";

type ScrollStackProps = {
  /** Section that holds still once its bottom meets the bottom of the viewport. */
  pinned: React.ReactNode;
  /** Section that rides up over it. Give it a z-index above 0. */
  children: React.ReactNode;
};

/**
 * Holds `pinned` in place while `children` scrolls up over it.
 *
 * CSS `position: sticky` cannot do this: a sticky box taller than the viewport
 * can never satisfy a `bottom: 0` constraint, so the browser leaves it in flow.
 * Instead the pinned section is translated down by exactly the distance
 * scrolled, which freezes it visually without touching layout — the page keeps
 * its natural height and the section above it keeps its scroll position.
 *
 * The hold releases once the overlay's top reaches the top of the viewport, at
 * which point it fully covers the pinned section and both scroll away together.
 */
export default function ScrollStack({ pinned, children }: ScrollStackProps) {
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const el = pinnedRef.current;
        const container = el?.parentElement;
        const overlay = el?.nextElementSibling as HTMLElement | null;

        if (el && container && overlay) {
          // The container is never transformed, so its rect is the honest origin.
          const containerTop = container.getBoundingClientRect().top + window.scrollY;
          const pinStart = containerTop + el.offsetHeight - window.innerHeight;
          const releaseAt = containerTop + overlay.offsetTop;
          const travel = Math.max(0, releaseAt - pinStart);

          setOffset(Math.max(0, Math.min(window.scrollY - pinStart, travel)));
        }

        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={pinnedRef}
        className="relative z-0"
        // --pin-offset lets a sticky child (the chapter rail) cancel the shift
        // out and keep holding at the top while the rest of the section freezes.
        style={
          {
            transform: `translate3d(0, ${offset}px, 0)`,
            "--pin-offset": `${offset}px`,
          } as React.CSSProperties
        }
      >
        {pinned}
      </div>
      {children}
    </div>
  );
}
