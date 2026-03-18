import SiteShell from "@/components/site-shell";

const posts = [
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
      "The Green and Renewable Innovations for Circular Economy forum gathered experts to discuss practical routes to clean energy growth.",
  },
];

export default function LatestPage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)]">LATEST</p>
        <h1 className="mt-4 text-4xl font-semibold text-[var(--brand-dark)] md:text-5xl">Latest Updates</h1>
        <div className="mt-10 space-y-6">
          {posts.map((post) => (
            <article key={post.title} className="thin-border rounded-2xl bg-white p-8">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{post.date}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--brand-dark)]">{post.title}</h2>
              <p className="mt-4 leading-relaxed text-slate-600">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
