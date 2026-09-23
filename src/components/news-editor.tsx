"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_IMAGE_BYTES, type Block, type Post } from "@/lib/post-types";

/**
 * The newsroom editor: a post is a title, a date, an author and a column of
 * blocks you add one at a time. Only two block kinds exist, text and image.
 *
 * It is a single client component holding both the list and the edit view,
 * because they share one piece of state — the post being worked on — and
 * splitting them would mean lifting it somewhere else anyway.
 *
 * Nothing here is a security boundary. The routes it calls re-check the gate,
 * so hiding a button is a convenience, never the protection.
 */

const inputClass =
  "type-body-sm w-full rounded-lg border border-white/20 bg-black/25 px-4 py-3 text-white transition placeholder:text-slate-500 focus:border-[#d8ff35] focus:outline-none focus:ring-2 focus:ring-[#d8ff35]/25";

const buttonGhost =
  "type-kicker inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 font-semibold text-white transition hover:border-[#d8ff35] hover:text-[#d8ff35] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/20 disabled:hover:text-white";

function newId(): string {
  return typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `b-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function blankPost(): Post {
  return {
    id: newId(),
    slug: "",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    author: "",
    excerpt: "",
    blocks: [{ id: newId(), type: "text", text: "" }],
    likes: 0,
    published: false,
    updatedAt: new Date().toISOString(),
  };
}

/** Textarea that grows with its content, so a long paragraph never scrolls in a box. */
function GrowingTextarea({
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${inputClass} resize-none leading-relaxed`}
    />
  );
}

/** The + in the gutter. Opens a two-item menu and inserts at `index`. */
function InsertButton({
  onInsert,
  label = "Add a block",
}: {
  onInsert: (type: "text" | "image") => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-[#d8ff35] hover:bg-[#d8ff35] hover:text-[#0e2238]"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            d="M12 5v14M5 12h14"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-white/20 bg-[#04383f] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          {(
            [
              { type: "text" as const, label: "Text", d: "M4 6h16M4 12h16M4 18h10" },
              {
                type: "image" as const,
                label: "Image",
                d: "M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M9.5 9.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
              },
            ]
          ).map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                onInsert(item.type);
                setOpen(false);
              }}
              className="type-body-sm flex w-full items-center gap-3 px-4 py-3 text-left text-white transition hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.d}
                />
              </svg>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageBlockEditor({
  block,
  onChange,
}: {
  block: Extract<Block, { type: "image" }>;
  onChange: (next: Partial<Extract<Block, { type: "image" }>>) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  /** Natural size, read before upload so the article can reserve the right box. */
  const measure = (file: File): Promise<{ width: number; height: number }> =>
    new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const probe = new window.Image();
      probe.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: probe.naturalWidth, height: probe.naturalHeight });
      };
      probe.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: 0, height: 0 });
      };
      probe.src = url;
    });

  const upload = async (file: File) => {
    setError("");
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`That image is over ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB.`);
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/news/media", { method: "POST", body });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "That upload did not go through.");
        return;
      }
      const size = await measure(file);
      onChange({ mediaId: payload.mediaId, width: size.width, height: size.height });
    } catch {
      setError("That upload did not go through.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {block.mediaId ? (
        <div className="overflow-hidden rounded-xl border border-white/15 bg-black/25">
          {/* Plain img: the source is our own media route and this preview is
              behind a password gate, so the optimizer buys nothing here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/news/media/${block.mediaId}`}
            alt={block.alt || "Uploaded image"}
            className="max-h-80 w-full object-contain"
          />
        </div>
      ) : (
        <div className="type-body-sm rounded-xl border border-dashed border-white/25 px-5 py-10 text-center text-slate-400">
          No image chosen yet.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className={`${buttonGhost} cursor-pointer`}>
          {uploading ? "Uploading…" : block.mediaId ? "Replace image" : "Choose image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
              event.target.value = "";
            }}
          />
        </label>
        <span className="type-kicker text-slate-500">
          PNG, JPEG, WebP, GIF or AVIF &middot; up to{" "}
          {Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB
        </span>
      </div>

      {error && <p className="type-kicker text-red-400">{error}</p>}

      <input
        type="text"
        value={block.alt}
        placeholder="Alt text — what the image shows, for screen readers"
        onChange={(event) => onChange({ alt: event.target.value })}
        className={inputClass}
      />
      <input
        type="text"
        value={block.caption}
        placeholder="Caption (optional)"
        onChange={(event) => onChange({ caption: event.target.value })}
        className={inputClass}
      />
    </div>
  );
}

export default function NewsEditor({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const patchBlock = (id: string, next: Partial<Block>) => {
    setDraft((post) =>
      post
        ? {
            ...post,
            blocks: post.blocks.map((b) => (b.id === id ? ({ ...b, ...next } as Block) : b)),
          }
        : post,
    );
  };

  const insertBlock = (index: number, type: "text" | "image") => {
    const block: Block =
      type === "text"
        ? { id: newId(), type: "text", text: "" }
        : { id: newId(), type: "image", mediaId: "", alt: "", caption: "", width: 0, height: 0 };
    setDraft((post) => {
      if (!post) return post;
      const blocks = post.blocks.slice();
      blocks.splice(index, 0, block);
      return { ...post, blocks };
    });
  };

  const moveBlock = (index: number, by: -1 | 1) => {
    setDraft((post) => {
      if (!post) return post;
      const target = index + by;
      if (target < 0 || target >= post.blocks.length) return post;
      const blocks = post.blocks.slice();
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...post, blocks };
    });
  };

  const removeBlock = (id: string) => {
    setDraft((post) =>
      post ? { ...post, blocks: post.blocks.filter((b) => b.id !== id) } : post,
    );
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.errors?.title ?? payload.error ?? "That did not save.");
        return;
      }
      const saved: Post = payload.post;
      setPosts((all) => {
        const without = all.filter((p) => p.id !== saved.id);
        return [saved, ...without].sort(
          (a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt),
        );
      });
      setDraft(null);
      setNotice(saved.published ? `Published “${saved.title}”.` : `Saved “${saved.title}” as a draft.`);
    } catch {
      setError("That did not save.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (post: Post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setError("");
    try {
      const response = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id }),
      });
      if (!response.ok) {
        setError("That did not delete.");
        return;
      }
      setPosts((all) => all.filter((p) => p.id !== post.id));
      setNotice(`Deleted “${post.title}”.`);
    } catch {
      setError("That did not delete.");
    }
  };

  /* ------------------------------------------------------------- edit view */

  if (draft) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#d8ff35]">
              {posts.some((p) => p.id === draft.id) ? "Editing" : "New post"}
            </p>
            <h1 className="type-title mt-2 font-semibold tracking-tight text-white">
              {draft.title || "Untitled"}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="type-body-sm rounded-full border border-white/25 px-5 py-2 font-semibold text-white transition hover:border-white/50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="type-body-sm rounded-full bg-[#d8ff35] px-6 py-2 font-semibold text-[#0e2238] transition hover:bg-[#c6f20b] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {error && <p className="type-body-sm mt-4 text-red-400">{error}</p>}

        <div className="mt-8 space-y-5 rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm md:p-8">
          <div>
            <label className="type-body-sm font-semibold text-white" htmlFor="post-title">
              Title
            </label>
            <input
              id="post-title"
              type="text"
              value={draft.title}
              placeholder="What happened?"
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              className={`${inputClass} mt-2`}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="type-body-sm font-semibold text-white" htmlFor="post-date">
                Date
              </label>
              <input
                id="post-date"
                type="date"
                value={draft.date}
                onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                className={`${inputClass} mt-2 [color-scheme:dark]`}
              />
            </div>
            <div>
              <label className="type-body-sm font-semibold text-white" htmlFor="post-author">
                Author
              </label>
              <input
                id="post-author"
                type="text"
                value={draft.author}
                placeholder="GEM Global"
                onChange={(event) => setDraft({ ...draft, author: event.target.value })}
                className={`${inputClass} mt-2`}
              />
            </div>
          </div>

          <div>
            <label className="type-body-sm font-semibold text-white" htmlFor="post-excerpt">
              Card summary{" "}
              <span className="font-normal text-slate-400">
                — optional; the first paragraph is used when this is blank
              </span>
            </label>
            <div className="mt-2">
              <GrowingTextarea
                value={draft.excerpt}
                onChange={(value) => setDraft({ ...draft, excerpt: value })}
                placeholder="One or two lines for the Home and About Us cards."
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- blocks */}

        <div className="mt-8">
          <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#d8ff35]">
            Contents
          </p>
          <p className="type-body-sm mt-2 text-slate-300">
            One block per line. Use the <span className="font-semibold text-white">+</span> in the
            margin to add a paragraph or an image above that block.
          </p>

          <div className="mt-6 space-y-4">
            {draft.blocks.map((block, index) => (
              <div key={block.id} className="group/block flex gap-3">
                <div className="flex w-8 shrink-0 flex-col items-center gap-2 pt-1">
                  <InsertButton
                    onInsert={(type) => insertBlock(index, type)}
                    label={`Insert a block above block ${index + 1}`}
                  />
                </div>

                <div className="min-w-0 flex-1 rounded-xl border border-white/12 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="type-kicker uppercase tracking-[0.14em] text-slate-400">
                      {block.type === "text" ? "Text" : "Image"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        aria-label="Move block up"
                        className={buttonGhost}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m6 14 6-6 6 6"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === draft.blocks.length - 1}
                        aria-label="Move block down"
                        className={buttonGhost}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m6 10 6 6 6-6"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        aria-label="Delete block"
                        className="type-kicker inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 font-semibold text-white transition hover:border-red-400 hover:text-red-400"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            d="M6 6l12 12M18 6 6 18"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {block.type === "text" ? (
                    <GrowingTextarea
                      value={block.text}
                      onChange={(text) => patchBlock(block.id, { text })}
                      placeholder="Write a paragraph…"
                      rows={3}
                    />
                  ) : (
                    <ImageBlockEditor
                      block={block}
                      onChange={(next) => patchBlock(block.id, next)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 pl-11">
            <InsertButton
              onInsert={(type) => insertBlock(draft.blocks.length, type)}
              label="Add a block at the end"
            />
            <span className="type-body-sm text-slate-400">Add a block</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(event) => setDraft({ ...draft, published: event.target.checked })}
              className="h-5 w-5 rounded border-white/30 bg-black/25 accent-[#d8ff35]"
            />
            <span className="type-body-sm text-white">
              Published
              <span className="block text-slate-400">
                Drafts stay here. Only published posts reach Home, About Us and Latest.
              </span>
            </span>
          </label>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="type-body-sm rounded-full bg-[#d8ff35] px-6 py-2 font-semibold text-[#0e2238] transition hover:bg-[#c6f20b] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------- list view */

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#d8ff35]">
            Newsroom
          </p>
          <h1 className="type-title mt-2 font-semibold tracking-tight text-white">Posts</h1>
          <p className="type-body-sm mt-2 text-slate-300">
            {posts.length} {posts.length === 1 ? "post" : "posts"},{" "}
            {posts.filter((p) => p.published).length} published.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNotice("");
            setError("");
            setDraft(blankPost());
          }}
          className="type-body-sm inline-flex items-center gap-2 rounded-full bg-[#d8ff35] px-6 py-2.5 font-semibold text-[#0e2238] transition hover:bg-[#c6f20b]"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
          New post
        </button>
      </div>

      {notice && <p className="type-body-sm mt-4 text-[#d8ff35]">{notice}</p>}
      {error && <p className="type-body-sm mt-4 text-red-400">{error}</p>}

      {posts.length === 0 ? (
        <div className="mt-10 rounded-[1.5rem] border border-dashed border-white/20 px-8 py-16 text-center">
          <p className="type-body font-semibold text-white">No posts yet.</p>
          <p className="type-body-sm mt-2 text-slate-400">
            Start one and it will appear on Home, About Us and Latest once published.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-[1.25rem] border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm transition hover:border-[#d8ff35]/40"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`type-kicker rounded-full px-3 py-1 font-semibold uppercase tracking-[0.12em] ${
                      post.published
                        ? "bg-[#d8ff35] text-[#0e2238]"
                        : "border border-white/25 text-slate-300"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span className="type-kicker text-slate-400">{post.date}</span>
                  <span className="type-kicker text-slate-400">
                    {post.blocks.length} {post.blocks.length === 1 ? "block" : "blocks"}
                  </span>
                  <span className="type-kicker text-slate-400">{post.likes} likes</span>
                </div>
                <p className="type-body mt-3 font-semibold text-white">{post.title}</p>
                <p className="type-kicker mt-1 text-slate-400">
                  {post.author || "GEM Global"} &middot; /latest/{post.slug}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {post.published && (
                  <a
                    href={`/latest/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-body-sm rounded-full border border-white/25 px-4 py-2 font-semibold text-white transition hover:border-[#d8ff35] hover:text-[#d8ff35]"
                  >
                    View
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setNotice("");
                    setError("");
                    setDraft({
                      ...post,
                      blocks: post.blocks.length
                        ? post.blocks
                        : [{ id: newId(), type: "text", text: "" }],
                    });
                  }}
                  className="type-body-sm rounded-full border border-white/25 px-4 py-2 font-semibold text-white transition hover:border-[#d8ff35] hover:text-[#d8ff35]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(post)}
                  className="type-body-sm rounded-full border border-white/25 px-4 py-2 font-semibold text-white transition hover:border-red-400 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
