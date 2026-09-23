import { promises as fs } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

/**
 * Newsroom storage. Same two-backend shape as `inquiries.ts`: Postgres when a
 * database URL is present, a JSON file otherwise, so `npm run dev` needs no
 * database and Vercel — whose filesystem is read-only — still works.
 *
 * A post is a title, a date, an author and an ordered list of blocks. Blocks
 * are what the editor adds line by line; only two kinds exist, text and image.
 */

import { slugify, type Block, type Media, type Post } from "@/lib/post-types";

// Re-exported so server callers have one import for storage and shape alike.
export {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  slugify,
  derivedExcerpt,
  formatPostDate,
} from "@/lib/post-types";
export type { Block, ImageBlock, Media, Post, TextBlock } from "@/lib/post-types";

const DATABASE_URL = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";

export function postsBackend(): "postgres" | "file" {
  return DATABASE_URL ? "postgres" : "file";
}

const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

/* ------------------------------------------------------------------ helpers */


/** Appends -2, -3 … until the slug is free. `exceptId` lets a post keep its own. */
function uniqueSlug(wanted: string, taken: Post[], exceptId: string): string {
  const others = new Set(taken.filter((p) => p.id !== exceptId).map((p) => p.slug));
  if (!others.has(wanted)) return wanted;
  let n = 2;
  while (others.has(`${wanted}-${n}`)) n += 1;
  return `${wanted}-${n}`;
}

function coerceBlocks(value: unknown): Block[] {
  if (!Array.isArray(value)) return [];
  const blocks: Block[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    const id = typeof item.id === "string" && item.id ? item.id : crypto.randomUUID();
    if (item.type === "image") {
      if (typeof item.mediaId !== "string" || !item.mediaId) continue;
      blocks.push({
        id,
        type: "image",
        mediaId: item.mediaId,
        alt: typeof item.alt === "string" ? item.alt.slice(0, 300) : "",
        caption: typeof item.caption === "string" ? item.caption.slice(0, 500) : "",
        width: Number.isFinite(Number(item.width)) ? Math.max(0, Math.trunc(Number(item.width))) : 0,
        height: Number.isFinite(Number(item.height))
          ? Math.max(0, Math.trunc(Number(item.height)))
          : 0,
      });
    } else {
      blocks.push({
        id,
        type: "text",
        text: typeof item.text === "string" ? item.text.slice(0, 8000) : "",
      });
    }
  }
  return blocks;
}



/* ----------------------------------------------------------------- postgres */

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!sql) throw new Error("no database configured");
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS news_posts (
        id         uuid PRIMARY KEY,
        slug       text UNIQUE NOT NULL,
        title      text NOT NULL,
        date       date NOT NULL,
        author     text NOT NULL DEFAULT '',
        excerpt    text NOT NULL DEFAULT '',
        blocks     jsonb NOT NULL DEFAULT '[]'::jsonb,
        likes      integer NOT NULL DEFAULT 0,
        published  boolean NOT NULL DEFAULT false,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS news_media (
        id           uuid PRIMARY KEY,
        content_type text NOT NULL,
        data         text NOT NULL,
        created_at   timestamptz NOT NULL DEFAULT now()
      )
    `;
    // One row per IP per post, so a like counts once and the number stays honest.
    await sql`
      CREATE TABLE IF NOT EXISTS news_likes (
        post_id uuid NOT NULL,
        ip      text NOT NULL,
        PRIMARY KEY (post_id, ip)
      )
    `;
  })();
  return schemaReady;
}

type Row = Record<string, unknown>;

function rowToPost(row: Row): Post {
  const rawDate = row.date;
  const date =
    rawDate instanceof Date
      ? rawDate.toISOString().slice(0, 10)
      : String(rawDate ?? "").slice(0, 10);
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    date,
    author: String(row.author ?? ""),
    excerpt: String(row.excerpt ?? ""),
    blocks: coerceBlocks(typeof row.blocks === "string" ? JSON.parse(row.blocks) : row.blocks),
    likes: Number(row.likes ?? 0),
    published: Boolean(row.published),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

/* ---------------------------------------------------------------------- file */

const FILE = process.env.NEWS_FILE
  ? path.resolve(process.env.NEWS_FILE)
  : path.join(process.cwd(), "data", "news.json");

const MEDIA_DIR = process.env.NEWS_MEDIA_DIR
  ? path.resolve(process.env.NEWS_MEDIA_DIR)
  : path.join(process.cwd(), "data", "news-media");

type FileShape = { posts: Post[]; likes: Record<string, string[]> };

// Read-modify-write is not atomic; chain writes so two saves cannot clobber.
let queue: Promise<unknown> = Promise.resolve();

function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readFileStore(): Promise<FileShape> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return { posts: parsed as Post[], likes: {} };
    const shape = parsed as Partial<FileShape>;
    return { posts: Array.isArray(shape.posts) ? shape.posts : [], likes: shape.likes ?? {} };
  } catch {
    return { posts: [], likes: {} };
  }
}

async function writeFileStore(store: FileShape): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf8");
}

/* -------------------------------------------------------------------- posts */

function sortPosts(posts: Post[]): Post[] {
  // Newest first by publication date, then by last edit so same-day posts have
  // a stable, predictable order.
  return posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt));
}

/** Every post, drafts included. Admin only — public callers pass `published`. */
export async function readPosts(options?: { published?: boolean }): Promise<Post[]> {
  const onlyPublished = options?.published === true;

  if (!sql) {
    const store = await readFileStore();
    const posts = onlyPublished ? store.posts.filter((p) => p.published) : store.posts;
    return sortPosts(posts.map((p) => ({ ...p, blocks: coerceBlocks(p.blocks) })));
  }

  await ensureSchema();
  const rows = onlyPublished
    ? await sql`SELECT * FROM news_posts WHERE published = true ORDER BY date DESC, updated_at DESC`
    : await sql`SELECT * FROM news_posts ORDER BY date DESC, updated_at DESC`;
  return rows.map((row) => rowToPost(row as Row));
}

/**
 * Published posts for the public pages, and never a thrown error.
 *
 * Home and About Us are prerendered. A database that is briefly unreachable at
 * build time should cost us a card section, not the whole site — so this
 * swallows the failure and renders the empty state instead.
 */
export async function readPublishedPosts(): Promise<Post[]> {
  try {
    return await readPosts({ published: true });
  } catch (error) {
    console.error("newsroom: could not read posts", error);
    return [];
  }
}

export async function readPost(slug: string): Promise<Post | null> {
  if (!sql) {
    const store = await readFileStore();
    const found = store.posts.find((p) => p.slug === slug);
    return found ? { ...found, blocks: coerceBlocks(found.blocks) } : null;
  }

  await ensureSchema();
  const rows = await sql`SELECT * FROM news_posts WHERE slug = ${slug} LIMIT 1`;
  return rows.length > 0 ? rowToPost(rows[0] as Row) : null;
}

export type PostInput = {
  id?: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  blocks: unknown;
  published: boolean;
};

/** Insert or update. Returns the stored post, with the slug it actually got. */
export async function savePost(input: PostInput): Promise<Post> {
  const id = input.id && /^[0-9a-f-]{36}$/i.test(input.id) ? input.id : crypto.randomUUID();
  const draft: Post = {
    id,
    slug: slugify(input.title),
    title: input.title.trim().slice(0, 300) || "Untitled",
    date: /^\d{4}-\d{2}-\d{2}$/.test(input.date)
      ? input.date
      : new Date().toISOString().slice(0, 10),
    author: input.author.trim().slice(0, 160),
    excerpt: input.excerpt.trim().slice(0, 600),
    blocks: coerceBlocks(input.blocks),
    likes: 0,
    published: Boolean(input.published),
    updatedAt: new Date().toISOString(),
  };

  if (!sql) {
    return serialise(async () => {
      const store = await readFileStore();
      const existing = store.posts.find((p) => p.id === id);
      const post: Post = {
        ...draft,
        slug: uniqueSlug(draft.slug, store.posts, id),
        likes: existing?.likes ?? 0,
      };
      store.posts = existing
        ? store.posts.map((p) => (p.id === id ? post : p))
        : [...store.posts, post];
      await writeFileStore(store);
      return post;
    });
  }

  await ensureSchema();
  const all = await readPosts();
  const slug = uniqueSlug(draft.slug, all, id);
  const rows = await sql`
    INSERT INTO news_posts (id, slug, title, date, author, excerpt, blocks, published, updated_at)
    VALUES (${id}, ${slug}, ${draft.title}, ${draft.date}, ${draft.author}, ${draft.excerpt},
            ${JSON.stringify(draft.blocks)}::jsonb, ${draft.published}, now())
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      date = EXCLUDED.date,
      author = EXCLUDED.author,
      excerpt = EXCLUDED.excerpt,
      blocks = EXCLUDED.blocks,
      published = EXCLUDED.published,
      updated_at = now()
    RETURNING *
  `;
  return rowToPost(rows[0] as Row);
}

export async function deletePost(id: string): Promise<void> {
  if (!sql) {
    await serialise(async () => {
      const store = await readFileStore();
      store.posts = store.posts.filter((p) => p.id !== id);
      delete store.likes[id];
      await writeFileStore(store);
    });
    return;
  }

  await ensureSchema();
  await sql`DELETE FROM news_likes WHERE post_id = ${id}`;
  await sql`DELETE FROM news_posts WHERE id = ${id}`;
}

/* -------------------------------------------------------------------- likes */

/**
 * Idempotent per IP. Returns the count after the attempt and whether this
 * caller had already liked it — the button reads both, so a second click shows
 * the real number instead of silently doing nothing.
 */
export async function likePost(
  slug: string,
  ip: string,
): Promise<{ likes: number; alreadyLiked: boolean } | null> {
  if (!sql) {
    return serialise(async () => {
      const store = await readFileStore();
      const post = store.posts.find((p) => p.slug === slug);
      if (!post) return null;
      const seen = store.likes[post.id] ?? [];
      if (seen.includes(ip)) return { likes: post.likes, alreadyLiked: true };
      store.likes[post.id] = [...seen, ip];
      post.likes += 1;
      await writeFileStore(store);
      return { likes: post.likes, alreadyLiked: false };
    });
  }

  await ensureSchema();
  const found = await sql`SELECT id, likes FROM news_posts WHERE slug = ${slug} LIMIT 1`;
  if (found.length === 0) return null;
  const postId = String((found[0] as Row).id);

  const claimed = await sql`
    INSERT INTO news_likes (post_id, ip) VALUES (${postId}, ${ip})
    ON CONFLICT DO NOTHING
    RETURNING ip
  `;
  if (claimed.length === 0) {
    return { likes: Number((found[0] as Row).likes ?? 0), alreadyLiked: true };
  }

  const rows = await sql`
    UPDATE news_posts SET likes = likes + 1 WHERE id = ${postId} RETURNING likes
  `;
  return { likes: Number((rows[0] as Row).likes ?? 0), alreadyLiked: false };
}

/* -------------------------------------------------------------------- media */

export async function saveMedia(contentType: string, bytes: Buffer): Promise<string> {
  const id = crypto.randomUUID();
  const data = bytes.toString("base64");

  if (!sql) {
    await fs.mkdir(MEDIA_DIR, { recursive: true });
    await fs.writeFile(
      path.join(MEDIA_DIR, `${id}.json`),
      JSON.stringify({ contentType, data }),
      "utf8",
    );
    return id;
  }

  await ensureSchema();
  await sql`
    INSERT INTO news_media (id, content_type, data) VALUES (${id}, ${contentType}, ${data})
  `;
  return id;
}

export async function readMedia(id: string): Promise<Media | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  if (!sql) {
    try {
      const raw = await fs.readFile(path.join(MEDIA_DIR, `${id}.json`), "utf8");
      const parsed = JSON.parse(raw) as Media;
      return parsed.data ? parsed : null;
    } catch {
      return null;
    }
  }

  await ensureSchema();
  const rows = await sql`SELECT content_type, data FROM news_media WHERE id = ${id} LIMIT 1`;
  if (rows.length === 0) return null;
  const row = rows[0] as Row;
  return { contentType: String(row.content_type), data: String(row.data) };
}
