import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";
import { derivedExcerpt, formatPostDate, type Post } from "@/lib/post-types";

/**
 * The newsroom card section, rendered on Home and About Us from the same data.
 *
 * Everything that differs between the two is a prop, so a third placement needs
 * no new component. `tone` is the one that matters: Home sits on a light ground
 * and About Us on the #04383f teal, and the dark variant uses white-alpha
 * surfaces so retinting that ground carries the cards with it.
 */

export type NewsCardsProps = {
  posts: Post[];
  /** Light grounds (Home) or the dark teal band (About Us). */
  tone?: "light" | "dark";
  kicker?: string;
  heading?: string;
  intro?: string;
  /** How many to show. The rest stay on /latest. */
  limit?: number;
  /** The section heading tag. /latest uses h1; the two placements use h2. */
  headingAs?: "h1" | "h2";
  /** null hides the link — /latest is already the full list. */
  viewAllHref?: string | null;
  viewAllLabel?: string;
  /** Extra classes on the <section>, for page-specific spacing. */
  className?: string;
};

const palette = {
  light: {
    kicker: "text-[var(--accent)]",
    heading: "text-[var(--brand-dark)]",
    intro: "text-slate-600",
    card: "thin-border bg-white hover:border-[var(--accent)] hover:shadow-[0_22px_44px_rgba(12,47,87,0.12)]",
    frame: "border-[var(--line)] bg-[var(--background)]",
    date: "text-slate-500",
    title: "text-[var(--brand-dark)]",
    body: "text-slate-600",
    meta: "text-slate-500",
    divider: "border-[var(--line)]",
    link: "text-[var(--brand)] hover:text-[var(--brand-dark)]",
    empty: "border-[var(--line)] text-slate-500",
  },
  dark: {
    kicker: "text-[#d8ff35]",
    heading: "text-white",
    intro: "text-slate-300",
    card: "border border-white/15 bg-white/[0.06] backdrop-blur-sm hover:border-[#d8ff35]/45 hover:bg-white/10",
    frame: "border-white/10 bg-black/20",
    date: "text-slate-400",
    title: "text-white",
    body: "text-slate-300",
    meta: "text-slate-400",
    divider: "border-white/10",
    link: "text-[#d8ff35] hover:text-white",
    empty: "border-white/20 text-slate-400",
  },
} as const;

function firstImage(post: Post) {
  return post.blocks.find((block) => block.type === "image");
}

export default function NewsCards({
  posts,
  tone = "light",
  kicker = "LATEST",
  heading = "News and updates",
  intro,
  limit = 3,
  headingAs: Heading = "h2",
  viewAllHref = "/latest",
  viewAllLabel = "View all updates",
  className = "",
}: NewsCardsProps) {
  const c = palette[tone];
  const shown = posts.slice(0, limit);

  return (
    <section className={`relative mx-auto w-full max-w-7xl px-6 py-20 md:px-8 ${className}`}>
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className={`type-kicker font-semibold tracking-[0.16em] ${c.kicker}`}>{kicker}</p>
            <Heading className={`type-emphasis mt-3 font-semibold tracking-tight ${c.heading}`}>
              {heading}
            </Heading>
            {intro && <p className={`type-body mt-4 ${c.intro}`}>{intro}</p>}
          </div>
          {viewAllHref && posts.length > 0 && (
            <Link
              href={viewAllHref}
              className={`type-body-sm inline-flex items-center gap-2 font-semibold transition ${c.link}`}
            >
              {viewAllLabel}
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 12h15m-6-6 6 6-6 6"
                />
              </svg>
            </Link>
          )}
        </div>
      </ScrollReveal>

      {shown.length === 0 ? (
        <div
          className={`type-body-sm mt-10 rounded-[1.5rem] border border-dashed px-8 py-14 text-center ${c.empty}`}
        >
          No updates have been published yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((post, index) => {
            const image = firstImage(post);
            const excerpt = derivedExcerpt(post);
            return (
              <ScrollReveal
                key={post.id}
                delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}
              >
                {/* relative, because the title link stretches over the whole
                    card with after:inset-0 so any part of it is clickable. */}
                <article
                  className={`card-lift group relative flex h-full flex-col rounded-2xl ${c.card}`}
                >
                  {image && image.type === "image" && (
                    <div
                      className={`relative aspect-[16/10] overflow-hidden rounded-t-2xl border-b ${c.frame}`}
                    >
                      <Image
                        src={`/api/news/media/${image.mediaId}`}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 90vw"
                        className="card-zoom object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-7">
                    <p className={`type-kicker uppercase tracking-[0.12em] ${c.date}`}>
                      {formatPostDate(post.date)}
                    </p>
                    <h3 className={`type-body-lg mt-3 font-semibold ${c.title}`}>
                      <Link href={`/latest/${post.slug}`} className="after:absolute after:inset-0">
                        {post.title}
                      </Link>
                    </h3>
                    {excerpt && <p className={`type-body-sm mb-6 mt-4 ${c.body}`}>{excerpt}</p>}

                    <div
                      className={`type-kicker mt-auto flex items-center justify-between gap-3 border-t pt-4 ${c.divider} ${c.meta}`}
                    >
                      <span className="truncate">{post.author || "GEM Global"}</span>
                      <span className="shrink-0 font-semibold">Read</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
