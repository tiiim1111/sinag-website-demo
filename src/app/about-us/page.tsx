import SiteShell from "@/components/site-shell";

export default function AboutUsPage() {
  return (
    <SiteShell>
      <section className="brand-gradient">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 text-white">
          <p className="text-xs font-semibold tracking-[0.16em] text-emerald-100">ABOUT US</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">Anywhere, Everywhere, Anytime</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-emerald-100">
            We derive our power from ambient sources, which means our systems are non-site-specific and can power your
            needs anywhere, everywhere, anytime.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-14">
        <div className="space-y-8 rounded-2xl bg-white p-8 shadow-sm thin-border">
          <p className="text-lg leading-relaxed text-slate-700">
            Established in 2014, we remain the exclusive power development company for the stationary power generation
            application of the US-patented Electromagnetic Energy-Flux Reactor (EER) technology worldwide.*
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            We seek to empower developing communities and support the global shift towards renewables and
            decarbonisation by promoting more sustainable ways of powering industries and society, in particular through
            the adoption of our groundbreaking EER Stationary Power Generator (EER-SPG) system.
          </p>
          <blockquote className="border-l-4 border-[var(--line)] pl-5 text-2xl leading-relaxed text-slate-500">
            Sinag Global is passionate about sustaining life and promoting more sustainable ways of powering our
            future.
          </blockquote>
          <p className="leading-relaxed text-slate-600">
            Leveraging the EER-SPG&apos;s high capacity factor, Sinag Global enters into PPA or JV agreements with strategic
            partners around the globe to provide access to electricity at highly competitive price points relative to the
            current market prices of today&apos;s conventional and alternative power generation technologies.
          </p>
          <p className="text-xs text-slate-500">*Except for the Philippines and Malaysia</p>
        </div>
      </section>
    </SiteShell>
  );
}
