import SiteShell from "@/components/site-shell";
import EnergyChallengeSection from "@/components/energy-challenge-section";

export default function OurSystemPage() {
  return (
    <SiteShell>
      <section className="brand-gradient">
        <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-32 text-white">
          <p className="type-kicker font-semibold tracking-[0.16em] text-emerald-100">OUR SYSTEM</p>
          <h1 className="type-title mt-4 max-w-4xl font-semibold leading-tight">
            EER Power Generation System
          </h1>
        </div>
      </section>

      <EnergyChallengeSection />
    </SiteShell>
  );
}
