import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/site-shell";
import PostActions from "@/components/post-actions";
import NewsCards from "@/components/news-cards";
import { derivedExcerpt, formatPostDate, readPost, readPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await readPost(slug);
  if (!post || !post.published) return { title: "Not found" };
  return {
    title: post.title,
    description: derivedExcerpt(post) || undefined,
    robots: { index: true, follow: true },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await readPost(slug);

  // A draft is a 404 to the public, not a preview. The editor has a View button
  // for the published article; there is no unlisted URL to leak.
  if (!post || !post.published) notFound();

  const others = (await readPosts({ published: true }))
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <SiteShell solidHeader>
      <article className="mx-auto w-full max-w-3xl px-6 pb-16 pt-32">
        <Link
          href="/latest"
          className="type-kicker inline-flex items-center gap-2 font-semibold uppercase tracking-[0.14em] text-[var(--brand)] transition hover:text-[var(--brand-dark)]"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 12H5m6 6-6-6 6-6"
            />
          </svg>
          All updates
        </Link>

        <header className="mt-6">
          <p className="type-kicker uppercase tracking-[0.12em] text-slate-500">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            {post.author && <> &middot; {post.author}</>}
          </p>
          <h1 className="type-title mt-3 font-semibold tracking-tight text-[var(--brand-dark)]">
            {post.title}
          </h1>
          {post.excerpt.trim() && (
            <p className="type-body-lg mt-5 text-slate-600">{post.excerpt.trim()}</p>
          )}
        </header>

        <div className="mt-10">
          {post.blocks.map((block) =>
            block.type === "text" ? (
              block.text.trim() ? (
                // whitespace-pre-line: a block is one paragraph, but a writer who
                // presses Enter inside it should get the break they typed.
                <p
                  key={block.id}
                  className="type-body mt-6 whitespace-pre-line leading-relaxed text-slate-700"
                >
                  {block.text}
                </p>
              ) : null
            ) : (
              <figure key={block.id} className="mt-10">
                <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
                  {block.width > 0 && block.height > 0 ? (
                    <Image
                      src={`/api/news/media/${block.mediaId}`}
                      alt={block.alt}
                      width={block.width}
                      height={block.height}
                      sizes="(min-width: 768px) 720px, 92vw"
                      className="h-auto w-full"
                    />
                  ) : (
                    // Uploaded before sizes were recorded, or the browser could
                    // not read them. No reserved box rather than a wrong one.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/news/media/${block.mediaId}`}
                      alt={block.alt}
                      className="h-auto w-full"
                    />
                  )}
                </div>
                {block.caption.trim() && (
                  <figcaption className="type-body-sm mt-3 text-slate-500">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            ),
          )}
        </div>

        <PostActions slug={post.slug} likes={post.likes} author={post.author} tone="light" />
      </article>

      {others.length > 0 && (
        <div className="border-t border-[var(--line)] bg-[#eef4f7]">
          <NewsCards
            posts={others}
            tone="light"
            kicker="MORE"
            heading="Other updates"
            limit={3}
            viewAllHref="/latest"
            viewAllLabel="View all"
          />
        </div>
      )}
    </SiteShell>
  );
}
