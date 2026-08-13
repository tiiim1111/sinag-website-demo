"use client";

import { useRef, useState } from "react";

export type Chapter = {
  id: string;
  /** Short label for the rail; the panel carries the full heading. */
  label: string;
  panel: React.ReactNode;
};

type ChapterTabsProps = {
  /** Anchor id for the whole section, e.g. "challenge". */
  id: string;
  kicker: string;
  ariaLabel: string;
  chapters: Chapter[];
  /** Set when the section opens a page, so the band clears the fixed header. */
  asPageOpener?: boolean;
};

/**
 * Chapter rail styled after the GE Vernova "5 Charges" band: numbered items in
 * condensed caps, split by hairline rules, over deep teal. The teal is dark
 * because the Gem Power logo is green and vanishes against a mid tone.
 *
 * Panels are passed in already rendered, so the sections that use this can stay
 * server components and every chapter's copy stays in the HTML.
 */
export default function ChapterTabs({
  id,
  kicker,
  ariaLabel,
  chapters,
  asPageOpener = false,
}: ChapterTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const next = (index + chapters.length) % chapters.length;
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(chapters.length - 1);
    }
  };

  return (
    <section id={id} className="scroll-mt-20">
      <div className="bg-[#04383f]">
        <div
          className={`mx-auto w-full max-w-7xl px-6 pb-4 md:px-8 ${
            asPageOpener ? "pt-24 md:pt-28" : "pt-14 md:pt-16"
          }`}
        >
          <p className="type-body-sm text-center font-semibold uppercase tracking-[0.24em] text-[#d8ff35]">
            {kicker}
          </p>

          <div
            role="tablist"
            aria-label={ariaLabel}
            className="mt-5 flex justify-start overflow-x-auto lg:justify-center"
          >
            {chapters.map((chapter, index) => {
              const isActive = index === activeTab;
              return (
                <button
                  key={chapter.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${chapter.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${chapter.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`group relative flex shrink-0 items-baseline gap-3 whitespace-nowrap px-5 pb-5 pt-1 md:px-7 ${
                    index > 0 ? "border-l border-white/25" : ""
                  }`}
                >
                  <span
                    className={`display-condensed type-body-lg transition ${
                      isActive ? "text-[#d8ff35]" : "text-white/40 group-hover:text-[#d8ff35]/70"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`display-condensed type-body-lg uppercase tracking-[0.02em] transition ${
                      isActive ? "text-white" : "text-white/55 group-hover:text-white/85"
                    }`}
                  >
                    {chapter.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-5 bottom-0 h-[3px] transition md:inset-x-7 ${
                      isActive ? "bg-[#d8ff35]" : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-[#eef4f7]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(12,47,87,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(12,47,87,0.05) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 text-[var(--brand-dark)] md:px-8 md:py-20">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              role="tabpanel"
              id={`panel-${chapter.id}`}
              aria-labelledby={`tab-${chapter.id}`}
              hidden={index !== activeTab}
            >
              {chapter.panel}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
