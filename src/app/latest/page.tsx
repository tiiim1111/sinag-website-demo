import type { Metadata } from "next";
import SiteShell from "@/components/site-shell";
import NewsCards from "@/components/news-cards";
import { readPosts } from "@/lib/posts";

// Posts are edited through /newsroom-admin, so this cannot be built once and
// cached forever. The save route revalidates it; this keeps a cold start honest.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest",
  description: "Announcements, milestones and events from GEM Global Holdings Nevada Corp.",
};

export default async function LatestPage() {
  const posts = await readPosts({ published: true });

  return (
    <SiteShell solidHeader>
      <div className="pt-24">
        <NewsCards
          posts={posts}
          tone="light"
          headingAs="h1"
          kicker="LATEST"
          heading="Latest updates"
          intro="Announcements, milestones, and events from GEM Global Holdings Nevada Corp. and the teams building the EER-SPG."
          limit={posts.length}
          viewAllHref={null}
        />
      </div>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-8">
        <div className="rounded-[2rem] bg-[var(--brand-dark)] px-8 py-10 text-white md:px-12">
          <p className="type-kicker font-semibold tracking-[0.16em] text-cyan-200">
            COMMUNICATION DIRECTION
          </p>
          <h2 className="type-emphasis mt-3 font-semibold">
            A sharper corporate newsroom for future announcements
          </h2>
          <p className="type-body mt-4 max-w-3xl text-slate-200">
            As the site evolves, this page can expand into a proper corporate updates hub for
            awards, strategic partnerships, technology milestones, investor communications, and
            public events.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
