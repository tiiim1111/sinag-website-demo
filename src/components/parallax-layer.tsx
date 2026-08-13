"use client";

import { useEffect, useRef, useState } from "react";

type ParallaxLayerProps = {
  children: React.ReactNode;
  className?: string;
  /** Total travel in px across the element's whole pass through the viewport. */
  distance?: number;
};

/**
 * Drifts its children against the scroll so a layer reads as sitting behind the
 * content. Give the wrapper more room than it needs (e.g. negative inset-y) —
 * the transform does not change the layout box, so the drift must not expose an
 * edge. Inert under prefers-reduced-motion.
 */
export default function ParallaxLayer({
  children,
  className = "",
  distance = 80,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const node = ref.current;
        if (node) {
          const rect = node.getBoundingClientRect();
          const viewportHeight = window.innerHeight || 1;
          const raw = (viewportHeight - rect.top) / (viewportHeight + rect.height);
          const progress = Math.max(0, Math.min(1, raw));
          setOffset((progress - 0.5) * -distance);
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
  }, [distance]);

  return (
    <div ref={ref} className={className} style={{ transform: `translate3d(0, ${offset}px, 0)` }}>
      {children}
    </div>
  );
}
