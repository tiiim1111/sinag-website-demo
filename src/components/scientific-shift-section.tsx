"use client";

import { useEffect, useRef, useState } from "react";

const overviewPrinciples = [
  {
    title: "Continuous energy harvesting from atmospheric and ambient sources",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-14 w-14 text-[#8fdb3d]">
        <path
          d="M7 16h15c4.7 0 7.5-3 7.5-7.5S26.7 1 22.5 1c-3 0-5.7 1.7-7 4.4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          d="M7 24h24c4.7 0 7.5 3 7.5 7.5S35.7 39 31.5 39c-3 0-5.7-1.7-7-4.4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          d="M7 32h11M7 8h9M7 20h19"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
      </svg>
    ),
  },
  {
    title: "Sustainable 24/7 stationary power generation capability",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-14 w-14 text-[#8fdb3d]">
        <circle
          cx="24"
          cy="24"
          r="14.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          d="M24 11a13 13 0 0 1 9.2 3.8M37 24a13 13 0 0 1-3.8 9.2M24 37a13 13 0 0 1-9.2-3.8M11 24a13 13 0 0 1 3.8-9.2"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path d="M24 15v9l6 3.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
      </svg>
    ),
  },
  {
    title: "A broader pathway for clean generation beyond conventional feedstock",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-14 w-14 text-[#8fdb3d]">
        <circle
          cx="24"
          cy="24"
          r="15.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          d="M30.8 17.2 26.4 28l-10.8 4.4L20 21.6Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
        <circle cx="24" cy="24" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
];

export default function ScientificShiftSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) {
          ticking = false;
          return;
        }

        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 1;
        const raw = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const next = Math.max(0, Math.min(1, raw));
        setProgress(next);
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

  const headingReveal = Math.max(0, Math.min(1, (progress - 0.08) / 0.18));
  const bodyReveal = Math.max(0, Math.min(1, (progress - 0.14) / 0.18));

  const getCardReveal = (index: number) => Math.max(0, Math.min(1, (progress - (0.2 + index * 0.06)) / 0.17));

  return (
    <section ref={sectionRef} className="scientific-parallax relative overflow-hidden bg-[#13191b]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(143,219,61,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(143,219,61,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-16 h-80 w-80 rounded-full bg-[#8fdb3d]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-cyan-400/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 text-white md:px-8 md:py-20">
          <div
            style={{
              transform: `translate3d(0, ${(1 - headingReveal) * 36}px, 0) scale(${0.92 + headingReveal * 0.08})`,
              opacity: headingReveal,
            }}
          >
          <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#8fdb3d]">Overview</p>
          <h2 className="type-title mt-4 max-w-6xl font-semibold tracking-tight md:type-display">
            The Scientific Shift Behind Continuous Energy Harvesting
          </h2>
          </div>

          <div
            style={{
              transform: `translate3d(0, ${(1 - bodyReveal) * 28}px, 0) scale(${0.96 + bodyReveal * 0.04})`,
              opacity: bodyReveal,
            }}
          >
            <p className="type-body-lg mt-8 max-w-6xl text-slate-300">
              In May 2023, researchers from the Department of Electrical and Computer Engineering at
              <span className="font-semibold text-[#8fdb3d]"> UMass Amherst</span> published peer-reviewed research in
              Advanced Materials supporting the scientific basis for continuous energy harvesting from atmospheric
              particles.
            </p>
            <p className="type-body-lg mt-10 text-slate-300">
              The study demonstrated three important principles:
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {overviewPrinciples.map((item, index) => {
              const reveal = getCardReveal(index);
              const direction = index - 1;
              const offsetY = (1 - reveal) * (24 + index * 6);
              const offsetX = (1 - reveal) * direction * 14;
              return (
                <article
                  key={item.title}
                  className="rounded-[1.75rem] border border-[#274530] bg-[#16261b]/95 px-6 py-7 shadow-[inset_0_0_0_1px_rgba(143,219,61,0.05)] backdrop-blur-sm"
                  style={{
                    transform: `translate3d(${offsetX}px, ${offsetY + (1 - reveal) * 38}px, 0) scale(${0.9 + reveal * 0.1})`,
                    opacity: reveal,
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="shrink-0">{item.icon}</div>
                    <p className="type-body-lg font-semibold leading-snug text-white">{item.title}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <p
            className="type-body-lg mt-10 max-w-6xl text-slate-300"
            style={{
              transform: `translate3d(0, ${(1 - bodyReveal) * 24}px, 0) scale(${0.97 + bodyReveal * 0.03})`,
              opacity: bodyReveal,
            }}
          >
            For Sinag Global, this reinforces the future of clean energy:
            <span className="font-semibold text-white">
              {" "}
              electricity can be generated through advanced electromagnetic processes
            </span>
            , not only through combustion, turbines, weather, or feedstock.
          </p>
        </div>
    </section>
  );
}
