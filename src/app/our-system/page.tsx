import SiteShell from "@/components/site-shell";

const systemPoints = [
  "Uses ambient energy sources through a patented magnetic induction process",
  "No fossil fuel combustion and no need for hydro, wind, or solar input",
  "Designed for stable, high-capacity-factor stationary generation",
];

export default function OurSystemPage() {
  return (
    <SiteShell>
      <section className="brand-gradient">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 text-white">
          <p className="text-xs font-semibold tracking-[0.16em] text-emerald-100">OUR SYSTEM</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
            Sinag Global System and Technology Direction
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-emerald-100">
            The EER-SPG system introduces a different path to renewable generation by extracting electricity from
            ambient energy via electromagnetic flux conversion.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="mb-8 rounded-2xl bg-white p-8 thin-border">
          <h2 className="text-2xl font-semibold text-[var(--brand-dark)]">How the system is positioned</h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            Sinag Global positions EER-SPG as a clean and sustainable stationary power generation technology for
            communities and industries that need round-the-clock power without traditional fuel dependency.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            By combining exclusive development rights in selected markets with project partnership models, the company
            supports structured deployments through PPA and JV arrangements.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {systemPoints.map((item) => (
            <article key={item} className="thin-border rounded-2xl bg-white p-6">
              <h2 className="text-xl font-semibold text-[var(--brand-dark)]">{item}</h2>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
