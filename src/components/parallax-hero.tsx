"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    video: "/1.mp4",
    title: "Step Into Revolutionary Renewable Energy",
    subtitle: "Clean, high-output power systems designed to support sustainable growth.",
    cta: "See more",
    rail: ["Renewable Energy", "Energy Access", "Sustainable Growth"],
  },
  {
    video: "/2.mp4",
    title: "Anywhere, Everywhere, Anytime",
    subtitle: "Reliable stationary power generation from ambient sources, wherever energy is needed.",
    cta: "See more",
    rail: ["Uninterrupted Power", "Distributed Generation", "Scalable Delivery"],
  },
  {
    video: "/3.mp4",
    title: "Rethinking Sustainable Power Supply",
    subtitle: "A cleaner path for industries, communities, and long-term decarbonization goals.",
    cta: "See more",
    rail: ["Decarbonization", "Partnership Models", "Future Projects"],
  },
];

export default function ParallaxHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

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
        const sectionTravel = Math.max(0, -rect.top);
        const next = Math.min(sectionTravel * 0.55, 320);
        setOffsetY(next);
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 9000);

    return () => window.clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[activeSlide];

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden text-white">
      {slides.map((slide, idx) => (
        <video
          key={slide.video}
          className={`absolute inset-0 h-full w-full scale-[1.14] object-cover transition-opacity duration-700 will-change-transform ${
            idx === activeSlide ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            transform: `translate3d(0, ${offsetY}px, 0) scale(1.14)`,
          }}
        >
          <source src={slide.video} type="video/mp4" />
        </video>
      ))}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-end px-6 pb-12 pt-28 md:px-8">
        <div className="mb-8 max-w-3xl">
          <div className="mb-6 border-l-[3px] border-[#d8ff35] pl-6">
            <h1 className="display-condensed type-display font-semibold uppercase tracking-tight">
              {current.title}
            </h1>
            <p className="type-body-lg mt-4 text-white/95">{current.subtitle}</p>
          </div>
          <Link
            href="/our-system"
            className="type-body mt-8 inline-flex items-center gap-3 rounded-full bg-[#d8ff35] px-7 py-3.5 font-semibold !text-[#0e2238] transition hover:bg-[#c6f20b] hover:!text-[#0e2238]"
          >
            {current.cta}
            <span aria-hidden="true" className="!text-[#0e2238]">
              &#8594;
            </span>
          </Link>
        </div>

        <div className="w-full">
          <div className="type-body grid grid-cols-3 gap-4 font-semibold">
            <p>{current.rail[0]}</p>
            <p>{current.rail[1]}</p>
            <p className="text-right">{current.rail[2]}</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className={`h-1 ${idx === activeSlide ? "bg-[#d8ff35]" : "bg-[#00a6a6]"}`} />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-7 text-[#d8ff35]">
            <button type="button" onClick={prevSlide} className="text-3xl leading-none opacity-90">
              &#8249;
            </button>
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`h-3 w-3 rounded-full border border-[#d8ff35] ${idx === activeSlide ? "bg-[#d8ff35]" : "bg-transparent"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
            <button type="button" onClick={nextSlide} className="text-3xl leading-none opacity-90">
              &#8250;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
