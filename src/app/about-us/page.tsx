import Image from "next/image";
import SiteShell from "@/components/site-shell";
import ScrollReveal from "@/components/scroll-reveal";

const leadership = [
  {
    name: "Bonifacio J. Eyales",
    role: "Group Chairman and CEO, Sinag Global Energy Corp.",
    image: "/team/bonifacio-j-eyales.png",
    body: "Founder of the company and inventor of EER technology, with over three decades of practice in electrical engineering, power demand management, energy conservation, and power plant operations.",
  },
  {
    name: "Jesus N. Alcordo",
    role: "Chairman",
    image: "/team/jesus-n-alcordo.png",
    body: "A long-serving executive in the energy and utilities sector whose leadership spans National Power Corp., Global Business Power Corp., and FDC Utilities Inc.",
  },
  {
    name: "Evaristo M. Narvaez, Jr.",
    role: "Director",
    image: "/team/evaristo-m-narvaez-jr.png",
    body: "Experienced executive across finance, industry, forestry, and economic development with a long background in corporate leadership and project finance.",
  },
  {
    name: "Leopoldo B. Carmelo",
    role: "Director",
    image: "/team/leopoldo-b-carmelo.png",
    body: "Electrical engineer, academic leader, and consultant with deep experience in planning, design, installation, and project management for electrical systems.",
  },
];

export default function AboutUsPage() {
  return (
    <SiteShell>
      <section className="brand-gradient">
        <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-32 text-white">
          <p className="type-kicker font-semibold tracking-[0.16em] text-emerald-100">ABOUT US</p>
          <h1 className="type-title mt-4 font-semibold leading-tight md:type-display">Anywhere, Everywhere, Anytime</h1>
          <p className="type-body mt-5 max-w-3xl text-emerald-100">
            We position Sinag as a renewable energy company focused on powering industries and communities through
            scalable, non-site-specific stationary generation solutions.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-14">
        <div className="space-y-8 rounded-2xl bg-white p-8 shadow-sm thin-border">
          <p className="type-body text-slate-700">
            Established in 2014, we remain the exclusive power development company for the stationary power generation
            application of the US-patented Electromagnetic Energy-Flux Reactor (EER) technology worldwide.*
          </p>
          <p className="type-body text-slate-700">
            We seek to empower developing communities and support the global shift towards renewables and
            decarbonization by promoting more sustainable ways of powering industries and society, in particular
            through the adoption of our EER Stationary Power Generator (EER-SPG) system.
          </p>
          <blockquote className="type-body-lg border-l-4 border-[var(--line)] pl-5 text-slate-500">
            Sinag Global is passionate about sustaining life and promoting more sustainable ways of powering our
            future.
          </blockquote>
          <p className="leading-relaxed text-slate-600">
            Leveraging the EER-SPG&apos;s high capacity factor, Sinag Global enters into PPA or JV agreements with strategic
            partners around the globe to provide access to electricity at highly competitive price points relative to the
            current market prices of today&apos;s conventional and alternative power generation technologies.
          </p>
          <p className="leading-relaxed text-slate-600">
            This direction aligns with the broader market story presented by Gem Power: end-to-end support, practical
            deployment, and a clean generation platform that can scale from localized applications to larger projects.
          </p>
          <p className="type-kicker text-slate-500">*Except for the Philippines and Malaysia</p>
        </div>
      </section>

      <section id="leadership" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-4">
        <div className="overflow-hidden rounded-[2rem] bg-[var(--brand-dark)] text-white shadow-[0_24px_60px_rgba(12,47,87,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <ScrollReveal className="order-2 p-8 md:p-10 lg:order-1 lg:p-12">
              <p className="type-kicker font-semibold tracking-[0.16em] text-cyan-200">LEADERSHIP</p>
              <h2 className="type-emphasis mt-3 font-semibold">
                Experienced leadership positioned for energy transition and deployment
              </h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-slate-200">
                Sinag Global is led by a management team with decades of combined experience across power generation,
                utilities, project finance, and electrical engineering &mdash; the disciplines required to take the
                EER-SPG from proven technology to deployed capacity.
              </p>
            </ScrollReveal>
            <ScrollReveal className="order-1 min-h-[280px] lg:order-2" delayClassName="delay-1">
              <div className="flex h-full min-h-[280px] items-center justify-center p-8 md:p-10">
                <div className="relative w-full max-w-[440px] rounded-[1.75rem] border border-white/12 bg-white px-8 py-10 shadow-[0_22px_50px_rgba(0,0,0,0.18)]">
                  <Image
                    src="/logo.png"
                    alt="Gem Power Philippines Corp."
                    width={2000}
                    height={357}
                    className="h-auto w-full"
                    priority={false}
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="grid gap-6 border-t border-white/10 px-8 py-8 md:grid-cols-2 xl:grid-cols-4 md:px-10 lg:px-12">
            {leadership.map((person, index) => (
              <ScrollReveal key={person.name} delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}>
                <article className="card-lift group rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm hover:border-cyan-200/45 hover:bg-white/10">
                  <div className="relative mb-5 aspect-square overflow-hidden rounded-[1.2rem] border border-white/10">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      sizes="(min-width: 1280px) 18vw, (min-width: 768px) 40vw, 90vw"
                      className="card-zoom object-cover"
                    />
                  </div>
                  <p className="type-body font-semibold">{person.name}</p>
                  <p className="type-body-sm mt-1 font-semibold text-cyan-200">{person.role}</p>
                  <p className="type-body-sm mt-4 text-slate-200">{person.body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="rounded-[2rem] bg-[var(--brand-dark)] px-8 py-10 text-white">
          <p className="type-kicker font-semibold tracking-[0.16em] text-cyan-200">WHAT WE STAND FOR</p>
          <h2 className="type-emphasis mt-3 font-semibold">A company narrative built around clean power, access, and long-term partnership</h2>
          <p className="type-body mt-4 max-w-4xl text-slate-200">
            The strongest common thread across the public references is not only the technology itself, but the
            business model around it: enabling access to electricity, supporting development, and offering cleaner
            alternatives through structured partnerships and practical deployment support.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
