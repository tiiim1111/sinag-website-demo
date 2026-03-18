import Link from "next/link";
import SiteShell from "@/components/site-shell";
import ParallaxHero from "@/components/parallax-hero";

const latestItems = [
  {
    title: "Sinag awarded by PIDC as one of Top 10 Most Promising Renewable Energy Solutions Provider in 2021",
    date: "June 3, 2021",
    excerpt:
      "Sinag is awarded by Philippine Inhouse Design Center as one of Top 10 Most Promising Renewable Energy Solutions Provider in 2021.",
  },
  {
    title: "SINAG represented by COO Mr. Danilo Enriquez joins panel at Green and Renewable Innovations for Circular Economy",
    date: "June 3, 2021",
    excerpt:
      "The event explored practical routes toward cleaner and circular energy systems in the Philippines.",
  },
];

export default function HomePage() {
  return (
    <SiteShell>
      <ParallaxHero />

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3 fade-up delay-1">
          {[
            "Solar and distributed energy integration",
            "Practical system design and execution",
            "Scalable support for enterprise growth",
          ].map((item) => (
            <article key={item} className="thin-border rounded-2xl bg-white p-6">
              <p className="text-lg font-semibold text-[var(--brand-dark)]">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h2 className="text-3xl font-semibold text-[var(--brand-dark)]">Latest</h2>
          <Link href="/latest" className="text-sm font-semibold text-[var(--brand)] hover:underline">
            View all updates
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {latestItems.map((post) => (
            <article key={post.title} className="thin-border rounded-2xl bg-white p-7 fade-up delay-2">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-slate-500">{post.date}</p>
              <h3 className="text-xl font-semibold text-[var(--brand-dark)]">{post.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 border-y border-[var(--line)] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-3xl font-semibold text-[var(--brand-dark)]">Let&apos;s power the future together.</p>
          <Link
            href="/investors-portal"
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]"
          >
            Explore prospects today
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
