/**
 * The shape of a post, and the pure helpers that read one.
 *
 * Kept apart from `posts.ts` on purpose: that module imports `node:fs` and the
 * Neon driver, so a `"use client"` component pulling a single constant out of
 * it would drag the whole server backend into the browser bundle. Everything
 * here is safe on both sides.
 */

export type TextBlock = { id: string; type: "text"; text: string };
export type ImageBlock = {
  id: string;
  type: "image";
  mediaId: string;
  alt: string;
  caption: string;
  /**
   * Natural pixel size, measured in the browser before upload. Stored so the
   * article can reserve the right box and not shift when the image lands.
   * 0 means unknown — render it without a reserved box rather than guessing.
   */
  width: number;
  height: number;
};
export type Block = TextBlock | ImageBlock;

export type Post = {
  id: string;
  slug: string;
  title: string;
  /** yyyy-mm-dd. Kept as a plain date — these are publication days, not instants. */
  date: string;
  author: string;
  excerpt: string;
  blocks: Block[];
  likes: number;
  published: boolean;
  updatedAt: string;
};

export type Media = { contentType: string; data: string };

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
  return base || "post";
}

/** First non-empty text block, trimmed — used when no excerpt was written. */
export function derivedExcerpt(post: Post): string {
  if (post.excerpt.trim()) return post.excerpt.trim();
  const first = post.blocks.find(
    (block): block is TextBlock => block.type === "text" && block.text.trim().length > 0,
  );
  if (!first) return "";
  const text = first.text.trim();
  return text.length > 220 ? `${text.slice(0, 217).trimEnd()}…` : text;
}

export function formatPostDate(date: string): string {
  // Parsed as noon UTC on purpose. `new Date("2021-06-03")` is midnight UTC,
  // and formatting that in a timezone behind UTC would print the 2nd.
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
