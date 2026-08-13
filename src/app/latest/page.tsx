import SiteShell from "@/components/site-shell";

const posts = [
  {
    title: "Sinag awarded by PIDC as one of Top 10 Most Promising Renewable Energy Solutions Provider in 2021",
    date: "June 3, 2021",
    excerpt:
      "A milestone that reinforced the company’s positioning as an emerging player in clean, reliable, and scalable renewable energy solutions.",
  },
  {
    title: "SINAG represented by COO Mr. Danilo Enriquez joins panel at Green and Renewable Innovations for Circular Economy",
    date: "June 3, 2021",
    excerpt:
      "The event highlighted practical routes to cleaner growth and underscored Sinag’s role in conversations around innovation, renewables, and circular energy systems.",
  },
];

export default function LatestPage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-32">
        <p className="type-kicker font-semibold tracking-[0.16em] text-[var(--accent)]">LATEST</p>
        <h1 className="type-title mt-4 font-semibold text-[var(--brand-dark)]">Latest Updates</h1>
        <p className="type-body mt-4 max-w-3xl text-slate-600">
          This section is currently based on publicly visible updates from the existing Sinag site and is framed here
          as a cleaner newsroom experience for the redesign.
        </p>
        <div className="mt-10 space-y-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="card-lift thin-border rounded-2xl bg-white p-8 hover:border-[var(--accent)] hover:shadow-[0_22px_44px_rgba(12,47,87,0.12)]"
            >
              <p className="type-kicker uppercase tracking-[0.12em] text-slate-500">{post.date}</p>
              <h2 className="type-body-lg mt-3 font-semibold text-[var(--brand-dark)]">{post.title}</h2>
              <p className="type-body mt-4 text-slate-600">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="rounded-[2rem] bg-[var(--brand-dark)] px-8 py-10 text-white">
          <p className="type-kicker font-semibold tracking-[0.16em] text-cyan-200">COMMUNICATION DIRECTION</p>
          <h2 className="type-emphasis mt-3 font-semibold">A sharper corporate newsroom for future announcements</h2>
          <p className="type-body mt-4 max-w-3xl text-slate-200">
            As the site evolves, this page can expand into a proper corporate updates hub for awards, strategic
            partnerships, technology milestones, investor communications, and public events.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
