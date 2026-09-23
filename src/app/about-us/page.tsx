import Image from "next/image";
import SiteShell from "@/components/site-shell";
import ChapterSplit from "@/components/chapter-split";
import PatentPortfolioSection from "@/components/patent-portfolio-section";
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
    body: "Masters Degree in Electrical engineer, academic leader, and consultant with deep experience in planning, design, installation, and project management for electrical systems.",
  },
];

export default function AboutUsPage() {
  return (
    // Dark teal ground, so the transparent header reads without solidHeader.
    <SiteShell>
      <section className="relative overflow-hidden bg-[#04383f]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(216,255,53,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(216,255,53,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-16 h-80 w-80 rounded-full bg-[#d8ff35]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-[40rem] h-96 w-96 rounded-full bg-cyan-400/8 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
        <ChapterSplit title="What We Stand For" dark>
          <ScrollReveal delayClassName="delay-1">
            <p className="type-body-lg font-semibold text-white">
              A company narrative built around clean power, access, and long-term partnership.
            </p>
          </ScrollReveal>
          <ScrollReveal className="mt-6" delayClassName="delay-2">
            <p className="type-body text-slate-300">
              The strongest common thread across the public references is not only the technology itself,
              but the business model around it: enabling access to electricity, supporting development, and
              offering cleaner alternatives through structured partnerships and practical deployment
              support.
            </p>
          </ScrollReveal>
        </ChapterSplit>
        </div>

      <section id="leadership" className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-20">
        <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] text-white backdrop-blur-sm">
          <ScrollReveal className="px-8 pb-8 pt-10 md:px-12 md:pt-12">
            <p className="type-kicker font-semibold tracking-[0.16em] text-[#d8ff35]">LEADERSHIP</p>
            <h2 className="type-emphasis mt-3 max-w-3xl font-semibold">
              Experienced leadership positioned for energy transition and deployment
            </h2>
            <p className="type-body-sm mt-5 max-w-3xl text-slate-300">
              Sinag Global is led by a management team with decades of combined experience across power
              generation, utilities, project finance, and electrical engineering &mdash; the disciplines
              required to take the EER-SPG from proven technology to deployed capacity.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 border-t border-white/10 px-8 py-8 md:grid-cols-2 md:px-12 xl:grid-cols-4">
            {leadership.map((person, index) => (
              <ScrollReveal
                key={person.name}
                delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}
              >
                {/* h-full so the four share a height — the bios differ in length
                    and were ending at four different depths. */}
                <article className="card-lift group h-full rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm hover:border-[#d8ff35]/45 hover:bg-white/10">
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
                  <p className="type-body-sm mt-1 font-semibold text-[#d8ff35]">{person.role}</p>
                  <p className="type-body-sm mt-4 text-slate-300">{person.body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

        <PatentPortfolioSection />
      </section>
    </SiteShell>
  );
}
