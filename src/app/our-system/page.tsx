import SiteShell from "@/components/site-shell";

const systemPoints = [
  "Uses electromagnetic induction feedback through a patented regenerative process",
  "Minimizes moving parts while avoiding fossil fuel input and harmful emissions",
  "Built for distributed generation, micro-grid, and scalable stationary applications",
];

export default function OurSystemPage() {
  return (
    <SiteShell>
      <section className="brand-gradient">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 text-white">
          <p className="type-kicker font-semibold tracking-[0.16em] text-emerald-100">OUR SYSTEM</p>
          <h1 className="type-title mt-4 max-w-4xl font-semibold leading-tight">
            EER Power Generation System
          </h1>
          <p className="type-body mt-5 max-w-3xl text-emerald-100">
            The EER-SPG system is positioned as a high-output stationary generation platform built around
            electromagnetic induction and regenerative field interaction.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="mb-8 rounded-2xl bg-white p-8 thin-border">
          <h2 className="type-emphasis font-semibold text-[var(--brand-dark)]">How the system works</h2>
          <p className="type-body mt-4 text-slate-600">
            The main principle underpinning the Electromagnetic Energy-Flux Reactor&apos;s operation is Faraday&apos;s Law of
            Induction. When coils are exposed to changing magnetic fields, voltage is induced into the coils. EER-SPG
            applies this principle through a network of reactors and transformers in a patented regenerative
            electromagnetic process.
          </p>
          <p className="type-body mt-4 text-slate-600">
            Similar to conventional generators, the system aims to produce varying magnetic field effects without
            depending on a rotating magnetic field in the same way traditional machines do. The positioning emphasizes
            cleaner power generation, efficient operation, and suitability for distributed applications.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {systemPoints.map((item) => (
            <article key={item} className="thin-border rounded-2xl bg-white p-6">
              <h2 className="type-body font-semibold text-[var(--brand-dark)]">{item}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-4 md:grid-cols-2">
        <article className="thin-border rounded-2xl bg-white p-8">
          <p className="type-kicker font-semibold tracking-[0.16em] text-[var(--accent)]">APPLICATION FIT</p>
          <h2 className="type-emphasis mt-3 font-semibold text-[var(--brand-dark)]">Designed for distributed and stationary power use cases</h2>
          <p className="type-body mt-4 text-slate-600">
            Public-facing messaging around the platform consistently highlights micro-grid and distributed generation
            applications, especially where reliable, sustainable, and flexible power supply is strategically important.
          </p>
        </article>
        <article className="thin-border rounded-2xl bg-white p-8">
          <p className="type-kicker font-semibold tracking-[0.16em] text-[var(--accent)]">MARKET STORY</p>
          <h2 className="type-emphasis mt-3 font-semibold text-[var(--brand-dark)]">Positioned as a cleaner alternative to conventional generation</h2>
          <p className="type-body mt-4 text-slate-600">
            Across Sinag and Gem Power references, the technology is presented as a route toward lower dependence on
            traditional energy sources, with a focus on sustainability, efficiency, and more resilient electricity
            access.
          </p>
        </article>
      </section>
    </SiteShell>
  );
}
