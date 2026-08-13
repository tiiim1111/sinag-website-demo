"use client";

import { useRef, useState } from "react";
import ScrollReveal from "@/components/scroll-reveal";

const valueCards = [
  {
    title: "Rising electricity costs",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <ellipse cx="17" cy="14" rx="7" ry="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M10 14v8c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5v-8" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <ellipse cx="30" cy="24" rx="7" ry="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M23 24v8c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5v-8" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Grid dependency and instability",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M18.7 8v32M29.3 8v32M8 18.7h32M8 29.3h32" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Transmission and distribution losses",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <path d="M10 36V16M22 36V10M34 36V24" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M8 36h28" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M17 15l9-7 12 9" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Intermittent renewable output",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <path d="M16 15c4-6 12-7 17-2s5 13 0 17" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
        <path d="M13 23c-3 1-5 4-5 7 0 4 3 8 8 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
        <path d="M20 31c2.6-4.3 5.8-7.5 10-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
        <circle cx="18" cy="13" r="2.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Fuel and feedstock exposure",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <rect x="12" y="8" width="22" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M34 14h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M18 18h10M18 24h10M18 30h10" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Carbon emissions and environmental risk",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <rect x="10" y="10" width="18" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M30 16c4 0 6 3 8 3M30 22c4 0 6 3 8 3M30 28c4 0 6 3 8 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Limited access to dependable baseload",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M14 14l20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    ),
  },
];

const topRowCards = valueCards.slice(0, 4);
const bottomRowCards = valueCards.slice(4);

const renewableLimits = [
  {
    source: "Solar",
    limitation: "Weather-dependent; not available at night; land / surface area requirements.",
  },
  {
    source: "Wind",
    limitation: "Variable output; site and wind-pattern dependent.",
  },
  {
    source: "Hydroelectric",
    limitation: "Reliable, but constrained by geography, water systems and infrastructure.",
  },
  {
    source: "Geothermal",
    limitation: "Baseload-capable, but highly site-specific and capital intensive.",
  },
  {
    source: "Biomass",
    limitation: "Feedstock-dependent and not fully free from emissions / logistics issues.",
  },
  {
    source: "Tidal & wave",
    limitation: "Predictable but limited to coastal / tidal environments with high build complexity.",
  },
];

const baseloadStats = [
  { value: "24/7", caption: "Load requirement for critical operations" },
  { value: "Baseload", caption: "Continuous output and capacity stability" },
  { value: "Clean", caption: "Decarbonisation without intermittency trade-off" },
];

const tabs = [
  { id: "energy-challenge", label: "The Energy Challenge" },
  { id: "renewable-limits", label: "Limits of Renewables" },
  { id: "baseload-gap", label: "The Baseload Gap" },
];

type ChallengeCardProps = {
  title: string;
  icon: React.ReactNode;
};

function ChallengeCard({ title, icon }: ChallengeCardProps) {
  return (
    <article className="card-lift mx-auto w-full max-w-[290px] border border-[#cfe0ea] bg-white text-[#103133] [clip-path:polygon(10%_0,100%_0,90%_100%,0_100%)] px-7 py-8 shadow-[0_16px_34px_rgba(12,47,87,0.08)] hover:border-[#0b7f8f]/40 hover:shadow-[0_26px_48px_rgba(12,47,87,0.16)]">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-5 text-center text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-[#1b3c3c]">
        {title}
      </p>
    </article>
  );
}

function EnergyChallengePanel() {
  return (
    <>
      <ScrollReveal>
        <h2 className="type-title max-w-6xl font-semibold tracking-tight text-[var(--brand-dark)] md:type-display">
          The Energy Challenge
        </h2>
      </ScrollReveal>
      <ScrollReveal className="mt-8" delayClassName="delay-1">
        <p className="type-body-lg max-w-4xl text-slate-700">The world does not only need more energy.</p>
      </ScrollReveal>
      <ScrollReveal className="mt-8" delayClassName="delay-2">
        <p className="type-body-lg max-w-6xl text-slate-700">
          It needs energy that is
          <span className="font-semibold text-[var(--brand-dark)]"> continuously available</span>,
          <span className="font-semibold text-[var(--brand-dark)]"> commercially viable</span>, and
          <span className="font-semibold text-[var(--brand-dark)]"> environmentally responsible</span>. Across industries and
          public-sector systems, energy users are facing the same pressure points:
        </p>
      </ScrollReveal>

      <div className="mt-10 space-y-5">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {topRowCards.map((item, index) => (
            <ScrollReveal key={item.title} delayClassName={index > 0 ? "delay-1" : ""}>
              <ChallengeCard title={item.title} icon={item.icon} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mx-auto grid max-w-[920px] justify-center gap-5 md:grid-cols-2 xl:grid-cols-3">
          {bottomRowCards.map((item, index) => (
            <ScrollReveal
              key={item.title}
              delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}
            >
              <ChallengeCard title={item.title} icon={item.icon} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ScrollReveal className="mt-10" delayClassName="delay-2">
        <p className="type-body mx-auto max-w-5xl text-center text-slate-700">
          For critical operations, power cannot be occasional. It must be available whenever the load requires it.
        </p>
      </ScrollReveal>
    </>
  );
}

function RenewableLimitsPanel() {
  return (
    <>
      <ScrollReveal>
        <h2 className="type-title max-w-6xl font-semibold tracking-tight text-[var(--brand-dark)] md:type-display">
          Limits of Existing Renewable Sources
        </h2>
      </ScrollReveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ScrollReveal delayClassName="delay-1">
          <p className="type-body text-slate-700">
            Traditional renewable energy sources have changed the global energy landscape, but still carry
            practical limitations.
          </p>
          <p className="type-body mt-6 text-slate-700">
            Solar and wind are clean, but weather-dependent. Hydroelectric power is reliable, but
            geographically constrained. Geothermal energy is powerful, but highly site-specific. Biomass,
            tidal, and wave energy can contribute to the mix, but each carries constraints around feedstock,
            location, infrastructure, or capacity factor.
          </p>
        </ScrollReveal>

        <ScrollReveal delayClassName="delay-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-left">
              <caption className="sr-only">
                Practical baseload limitations of existing renewable energy sources
              </caption>
              <thead>
                <tr className="bg-[#dfe9ef]">
                  <th
                    scope="col"
                    className="type-kicker whitespace-nowrap px-4 py-3 font-semibold uppercase tracking-[0.12em] text-[#0a745f]"
                  >
                    Source
                  </th>
                  <th
                    scope="col"
                    className="type-kicker px-4 py-3 font-semibold uppercase tracking-[0.12em] text-[#0a745f]"
                  >
                    Practical limitation for baseload
                  </th>
                </tr>
              </thead>
              <tbody>
                {renewableLimits.map((row, index) => (
                  <tr key={row.source} className={index % 2 === 0 ? "bg-white/70" : "bg-white/40"}>
                    <th
                      scope="row"
                      className="type-body-sm whitespace-nowrap border-t border-[#cfe0ea] px-4 py-3 text-left font-semibold uppercase tracking-[0.06em] text-[var(--brand-dark)]"
                    >
                      {row.source}
                    </th>
                    <td className="type-body-sm border-t border-[#cfe0ea] px-4 py-3 text-slate-700">
                      {row.limitation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-12" delayClassName="delay-2">
        <div className="rounded-2xl border border-[#cfe0ea] bg-white/70 px-8 py-10 text-center">
          <p className="type-body-lg text-slate-700">
            The challenge is not whether renewables matter.{" "}
            <span className="font-semibold text-[var(--brand-dark)]">They do.</span>
          </p>
          <p className="type-body-lg mx-auto mt-6 max-w-4xl text-slate-700">
            The challenge is how to deliver clean baseload electricity when the sun is not shining, the wind
            is not blowing, the site is not ideal, and{" "}
            <span className="font-semibold text-[var(--brand-dark)]">the load cannot wait</span>.
          </p>
        </div>
      </ScrollReveal>
    </>
  );
}

function BaseloadGapPanel() {
  return (
    <>
      <ScrollReveal>
        <h2 className="type-title max-w-6xl font-semibold tracking-tight text-[var(--brand-dark)] md:type-display">
          The Baseload Gap
        </h2>
      </ScrollReveal>

      <ScrollReveal className="mt-8" delayClassName="delay-1">
        <p className="type-body max-w-5xl text-slate-700">
          Critical energy users need baseload power. Factories, utilities, government facilities, hospitals,
          data centres, logistics networks, and essential infrastructure cannot operate on intermittent
          supply alone.
        </p>
      </ScrollReveal>
      <ScrollReveal className="mt-6" delayClassName="delay-1">
        <p className="type-body max-w-5xl text-slate-700">
          Today, many of these users still rely on fossil fuel generation or grid power because they need
          continuous output, frequency stability, and dependable capacity. This creates a structural gap in
          the energy transition:
        </p>
      </ScrollReveal>
      <ScrollReveal className="mt-6" delayClassName="delay-2">
        <p className="type-body max-w-5xl text-slate-700">
          Clean power is available. Baseload power is available.{" "}
          <span className="font-semibold text-[var(--brand-dark)]">
            Clean on-demand baseload power remains scarce.
          </span>
        </p>
      </ScrollReveal>
      <ScrollReveal className="mt-10" delayClassName="delay-2">
        <p className="type-emphasis font-semibold text-[#0a745f]">EER-SPG is designed for that gap.</p>
      </ScrollReveal>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {baseloadStats.map((stat, index) => (
          <ScrollReveal
            key={stat.value}
            delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}
          >
            <article className="card-lift h-full rounded-2xl border border-[#cfe0ea] bg-white px-8 py-8 text-center shadow-[0_14px_28px_rgba(12,47,87,0.06)] hover:border-[#0a745f]/40 hover:shadow-[0_24px_44px_rgba(12,47,87,0.14)]">
              <p className="type-title font-semibold tracking-tight text-[#0a745f]">{stat.value}</p>
              <p className="type-kicker mt-3 font-semibold uppercase tracking-[0.1em] text-slate-600">
                {stat.caption}
              </p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}

const panels = [EnergyChallengePanel, RenewableLimitsPanel, BaseloadGapPanel];

type EnergyChallengeSectionProps = {
  /** Set when the section is the first thing on a page, so it clears the fixed header. */
  asPageOpener?: boolean;
  /**
   * Our System splits the challenge into three chapters behind tabs.
   * The homepage shows only the first, with no tab bar.
   */
  tabbed?: boolean;
};

/** "The Energy Challenge" — rendered on both the homepage and Our System. */
export default function EnergyChallengeSection({
  asPageOpener = false,
  tabbed = false,
}: EnergyChallengeSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
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
      focusTab(tabs.length - 1);
    }
  };

  return (
    <section id="challenge" className="relative scroll-mt-20 overflow-hidden bg-[#eef4f7]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(12,47,87,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(12,47,87,0.05) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />
      <div
        className={`relative mx-auto w-full max-w-7xl px-6 pb-16 text-[var(--brand-dark)] md:px-8 md:pb-20 ${
          asPageOpener ? "pt-32 md:pt-36" : "pt-16 md:pt-20"
        }`}
      >
        <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#00a8a8]">Challenge</p>

        {!tabbed ? (
          <div className="pt-4">
            <EnergyChallengePanel />
          </div>
        ) : (
          <>
            <div
              role="tablist"
              aria-label="The energy challenge"
              className="mt-6 flex gap-2 overflow-x-auto border-b border-[#cfe0ea] pb-px"
            >
              {tabs.map((tab, index) => {
                const isActive = index === activeTab;
                return (
                  <button
                    key={tab.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                    className={`type-body-sm -mb-px whitespace-nowrap border-b-2 px-4 py-3 font-semibold transition ${
                      isActive
                        ? "border-[#00a8a8] text-[var(--brand-dark)]"
                        : "border-transparent text-slate-500 hover:border-[#cfe0ea] hover:text-[var(--brand-dark)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {panels.map((Panel, index) => (
              <div
                key={tabs[index].id}
                role="tabpanel"
                id={`panel-${tabs[index].id}`}
                aria-labelledby={`tab-${tabs[index].id}`}
                hidden={index !== activeTab}
                className="pt-10"
              >
                <Panel />
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
