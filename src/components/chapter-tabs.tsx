"use client";

import { useRef, useState } from "react";
import ParallaxLayer from "@/components/parallax-layer";

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
  /**
   * Ride up over the section above with a rounded lip and a cast shadow, so
   * scrolling from one chapter set to the next reads as one layer over another.
   */
  overlapPrevious?: boolean;
  /**
   * Extra room below the panel. A pinned section pins as soon as its bottom
   * meets the bottom of the viewport, so without this the trigger fires after
   * only the section's overflow — a few dozen pixels — and the chapter is
   * covered before it can be read.
   */
  trailingSpace?: boolean;
};

/**
 * Chapter rail styled after the GE Vernova "5 Charges" band: numbered items in
 * condensed caps, split by hairline rules, over deep teal. The teal is dark
 * because the Gem Global logo is green and vanishes against a mid tone.
 *
 * Panels are passed in already rendered, so the sections that use this can stay
 * server components and every chapter's copy stays in the HTML.
 */
export default function ChapterTabs({
  id,
  kicker,
  ariaLabel,
  chapters,
  overlapPrevious = false,
  trailingSpace = false,
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
    <section
      id={id}
      // The lip and shadow live on the rail below, not here: `overflow-hidden`
      // on this element would turn it into a scroll container and kill the
      // rail's stickiness.
      className={`scroll-mt-20 ${overlapPrevious ? "relative z-10 -mt-10" : ""}`}
    >
      <div
        className={`sticky top-0 z-20 bg-[#04383f] ${
          overlapPrevious
            ? // Arbitrary *property* rather than shadow-[…]: Tailwind's shadow
              // utility drops an arbitrary value whose first offset is negative.
              "rounded-t-[2.5rem] [box-shadow:0_-26px_60px_rgba(4,56,63,0.28)]"
            : ""
        }`}
        // The parent shifts down by --pin-offset during a pin; -2x that leaves a
        // net -1x, so the rail slides up and out instead of hanging around
        // stacked under the next section's rail. Sticks normally when unpinned.
        style={{ transform: "translateY(calc(var(--pin-offset, 0px) * -2))" }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 pb-3 pt-20 md:px-8">
          <p className="type-body-sm text-center font-semibold uppercase tracking-[0.24em] text-[#d8ff35]">
            {kicker}
          </p>

          <div
            role="tablist"
            aria-label={ariaLabel}
            className="mt-4 flex justify-start overflow-x-auto lg:justify-center"
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
                  className={`group relative flex shrink-0 items-baseline gap-3 whitespace-nowrap px-5 pb-4 pt-1 md:px-7 ${
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
        {/* Inset vertically past the panel so the drift never exposes an edge. */}
        <ParallaxLayer
          className="pointer-events-none absolute inset-x-0 -inset-y-16"
          distance={90}
        >
          <div
            aria-hidden="true"
            className="h-full w-full opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(rgba(12,47,87,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(12,47,87,0.05) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
        </ParallaxLayer>
        <div
          className={`relative mx-auto w-full max-w-7xl px-6 pt-16 text-[var(--brand-dark)] md:px-8 md:pt-20 ${
            trailingSpace ? "pb-[38vh]" : "pb-16 md:pb-20"
          }`}
        >
          {/* Every panel sits in the same grid cell, so the section is always as
              tall as its longest chapter and switching tabs does not resize it.
              Inactive panels use `visibility` rather than the `hidden` attribute:
              hidden removes the box from layout, which is what made the height
              jump. Visibility still takes inactive panels out of the a11y tree,
              out of tab order, and out of pointer events. */}
          <div className="grid">
            {chapters.map((chapter, index) => {
              const isActive = index === activeTab;
              return (
                <div
                  key={chapter.id}
                  role="tabpanel"
                  id={`panel-${chapter.id}`}
                  aria-labelledby={`tab-${chapter.id}`}
                  aria-hidden={!isActive}
                  className={`col-start-1 row-start-1 ${isActive ? "" : "invisible"}`}
                >
                  {chapter.panel}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
