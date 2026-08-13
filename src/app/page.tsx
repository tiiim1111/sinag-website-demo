import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/site-shell";
import ParallaxHero from "@/components/parallax-hero";
import ScientificShiftSection from "@/components/scientific-shift-section";
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
    body: "Power users are under pressure from increasing electricity prices and the long-term cost exposure of conventional supply models.",
  },
  {
    title: "Grid dependency and instability",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M18.7 8v32M29.3 8v32M8 18.7h32M8 29.3h32" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
    body: "Grid power remains essential, but is exposed to congestion, transmission losses, instability, and rising demand.",
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
    body: "Delivering clean power at scale still means dealing with infrastructure inefficiencies between generation and end use.",
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
    body: "Solar and wind accelerate transition, but their output remains variable and cannot always satisfy critical baseload demand.",
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
    body: "Conventional generation depends on supply chains, logistics, and fuel costs that create ongoing volatility and operating risk.",
  },
  {
    title: "Carbon emissions and environmental risk",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <rect x="10" y="10" width="18" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M30 16c4 0 6 3 8 3M30 22c4 0 6 3 8 3M30 28c4 0 6 3 8 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    ),
    body: "Energy strategies are increasingly measured against emissions, environmental impact, and long-term sustainability commitments.",
  },
  {
    title: "Limited access to dependable baseload",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M14 14l20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    ),
    body: "Critical operations need power that is continuously available, commercially viable, and environmentally responsible.",
  },
];

const topRowCards = valueCards.slice(0, 4);
const bottomRowCards = valueCards.slice(4);

export default function HomePage() {
  return (
    <SiteShell>
      <ParallaxHero />
      <ScientificShiftSection />

      <section className="relative overflow-hidden bg-[#eef4f7]">
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
          <ScrollReveal>
            <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#00a8a8]">Challenge</p>
          </ScrollReveal>
          <ScrollReveal className="mt-4" delayClassName="delay-1">
            <h2 className="type-title max-w-6xl font-semibold tracking-tight text-[var(--brand-dark)] md:type-display">
              The Energy Challenge
            </h2>
          </ScrollReveal>
          <ScrollReveal className="mt-8" delayClassName="delay-1">
            <p className="type-body-lg max-w-4xl text-slate-700">
              The world does not only need more energy.
            </p>
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
                  <article className="mx-auto w-full max-w-[290px] border border-[#cfe0ea] bg-white text-[#103133] [clip-path:polygon(10%_0,100%_0,90%_100%,0_100%)] px-7 py-8 shadow-[0_16px_34px_rgba(12,47,87,0.08)]">
                    <div className="flex justify-center">{item.icon}</div>
                    <p className="mt-5 text-center text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-[#1b3c3c]">
                      {item.title}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
            <div className="mx-auto grid max-w-[920px] justify-center gap-5 md:grid-cols-2 xl:grid-cols-3">
              {bottomRowCards.map((item, index) => (
                <ScrollReveal
                  key={item.title}
                  delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}
                >
                  <article className="mx-auto w-full max-w-[290px] border border-[#cfe0ea] bg-white text-[#103133] [clip-path:polygon(10%_0,100%_0,90%_100%,0_100%)] px-7 py-8 shadow-[0_16px_34px_rgba(12,47,87,0.08)]">
                    <div className="flex justify-center">{item.icon}</div>
                    <p className="mt-5 text-center text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-[#1b3c3c]">
                      {item.title}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal className="mt-10" delayClassName="delay-2">
            <p className="type-body mx-auto max-w-5xl text-center text-slate-700">
              For critical operations, power cannot be occasional. It must be available whenever the load requires it.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#14191b]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(143,219,61,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(143,219,61,0.045) 1px, transparent 1px)",
            backgroundSize: "68px 68px",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 text-white md:px-8 md:py-20">
          <ScrollReveal>
            <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#8fdb3d]">Overview</p>
          </ScrollReveal>
          <ScrollReveal className="mt-4" delayClassName="delay-1">
            <h2 className="type-title max-w-5xl font-semibold tracking-tight md:type-display">
              What We&apos;ve Built
            </h2>
          </ScrollReveal>
          <ScrollReveal className="mt-8" delayClassName="delay-1">
            <p className="type-body-lg max-w-6xl text-slate-300">
              <span className="font-semibold text-[#8fdb3d]">EER-SPG</span> stands for{" "}
              <span className="font-semibold text-white">Electromagnetic Energy-Flux Reactor</span>, Sinag Global&apos;s
              stationary electromagnetic power generation system, developed to provide clean baseload electricity on
              demand.
            </p>
          </ScrollReveal>
          <ScrollReveal className="mx-auto mt-10 max-w-4xl" delayClassName="delay-2">
            <div className="relative mx-auto aspect-[16/9] w-full">
              <Image
                src="/overview/eer.png"
                alt="EER-SPG container platform"
                fill
                sizes="(min-width: 1280px) 60vw, (min-width: 768px) 80vw, 100vw"
                className="object-contain"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal className="mt-10" delayClassName="delay-2">
            <ul className="type-body-sm max-w-5xl space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-full bg-[#8fdb3d]" />
                <span>
                  Unlike conventional generation, EER-SPG does not depend on fuel combustion, feedstock supply, solar
                  exposure, wind conditions, water flow, or rotating generator mechanisms.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-full bg-[#8fdb3d]" />
                <span>
                  It uses electromagnetic induction, back-EMF management, magnetic flux cancellation, and a looped
                  excitation architecture to generate regulated AC power for real-world electrical loads.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-full bg-[#8fdb3d]" />
                <span>
                  The result is a clean energy platform designed for continuous, scalable, and independent power
                  generation.
                </span>
              </li>
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f8f7f1]">
        <div className="pointer-events-none absolute inset-y-0 right-[18%] hidden w-[38rem] rounded-full border border-[#d7e6df] opacity-60 lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-[12%] hidden w-[28rem] rounded-full border border-[#d7e6df] opacity-50 lg:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[6.5rem] hidden border-t border-dashed border-[#d6dfd7] md:block" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <ScrollReveal>
            <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#0d8d77]">At A Glance</p>
          </ScrollReveal>
          <ScrollReveal className="mt-4" delayClassName="delay-1">
            <h2 className="type-title max-w-6xl font-semibold tracking-tight text-[#122b28] md:type-display">
              Why the EER-SPG Matters Now
            </h2>
          </ScrollReveal>
          <ScrollReveal className="mt-10" delayClassName="delay-1">
            <p className="type-body-lg max-w-6xl text-[#22302f]">
              Energy users need power that is <span className="font-semibold">clean, stable, affordable,</span> and{" "}
              <span className="font-semibold">independent.</span>
            </p>
          </ScrollReveal>
          <ScrollReveal className="mt-10" delayClassName="delay-2">
            <p className="type-body max-w-6xl text-[#2c3837]">
              Solar and wind have accelerated the energy transition, but their output remains intermittent. Fossil
              fuels remain dispatchable, but carry emissions, price volatility, and supply-chain risk. Grid power
              remains essential, but is exposed to congestion, transmission losses, instability, and rising demand.
            </p>
          </ScrollReveal>
          <ScrollReveal className="mt-10" delayClassName="delay-2">
            <p className="type-emphasis max-w-5xl font-semibold text-[#0a745f]">
              The EER-SPG exists to close this gap.
            </p>
          </ScrollReveal>
          <ScrollReveal className="mt-10" delayClassName="delay-2">
            <p className="type-body max-w-6xl text-[#22302f]">
              We provide a <span className="font-semibold">clean on-demand baseload alternative</span> for industrial
              facilities, commercial developments, public infrastructure, utilities, microgrids, special economic
              zones, and communities that need reliable electricity{" "}
              <span className="font-semibold">without fuel dependency.</span>
            </p>
          </ScrollReveal>

          <div className="relative mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Clean",
                body: "Zero GHG and carbon emission positioning",
              },
              {
                title: "Stable",
                body: "Baseload power for continuous demand",
              },
              {
                title: "Independent",
                body: "Reduced reliance on fuel, feedstock and weather",
              },
            ].map((item, index) => (
              <ScrollReveal
                key={item.title}
                delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}
              >
                <article className="rounded-2xl border border-[#d8d5c8] bg-white/96 px-8 py-7 text-center shadow-[0_14px_28px_rgba(18,43,40,0.06)]">
                  <h3 className="type-emphasis font-semibold tracking-tight text-[#0a745f]">{item.title}</h3>
                  <p className="type-body-sm mt-3 text-[#5d6665]">{item.body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden text-white">
        {/* Placeholder photo — swap public/cta/power-the-future.jpg with the final art. */}
        <Image
          src="/cta/power-the-future.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/45 lg:bg-black/30" />
        {/* Narrow viewports crop into the sky, so darken top-down; wide ones darken left-to-right. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-transparent lg:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-black/45 via-black/15 to-transparent lg:block"
        />

        <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-24 md:px-8 md:py-32 lg:min-h-[34rem]">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <ScrollReveal>
              <h2 className="display-condensed type-title font-semibold uppercase tracking-tight md:type-display">
                Let&apos;s power the future together
              </h2>
            </ScrollReveal>

            <ScrollReveal
              className="lg:border-l lg:border-white/35 lg:pl-16"
              delayClassName="delay-1"
            >
              <p className="type-body-lg max-w-xl text-white/95">
                The EER-SPG delivers clean, continuous baseload power &mdash; no fuel, no feedstock, no weather
                dependency. Built for industries, utilities, microgrids, and the communities they serve.
              </p>
              <Link
                href="/our-system"
                className="type-body mt-9 inline-flex items-center gap-4 rounded-full bg-[#d8ff35] py-2 pl-7 pr-2 font-semibold !text-[#0e2238] transition hover:bg-[#c6f20b]"
              >
                Know more about our solution
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 12h15m-6-6 6 6-6 6"
                    />
                  </svg>
                </span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
