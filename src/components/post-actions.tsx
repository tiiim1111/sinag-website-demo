"use client";

import { useState, useSyncExternalStore } from "react";

/**
 * The "Share this" and "Like" row at the foot of a post.
 *
 * The like count is authoritative on the server — one per IP, enforced by a
 * primary key. localStorage only remembers that *this browser* already liked,
 * so the button comes back filled after a reload instead of inviting a click
 * the server will ignore.
 */

type PostActionsProps = {
  slug: string;
  likes: number;
  author: string;
  tone?: "light" | "dark";
};

const palette = {
  light: {
    label: "text-slate-500",
    button:
      "border-[var(--line)] text-[var(--brand-dark)] hover:border-[var(--brand)] hover:text-[var(--brand)]",
    liked: "border-[var(--brand)] bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)]",
    divider: "border-[var(--line)]",
    author: "text-slate-600",
    authorName: "text-[var(--brand-dark)]",
    avatar: "bg-[var(--brand)] text-white",
    note: "text-slate-500",
  },
  dark: {
    label: "text-slate-400",
    button: "border-white/25 text-white hover:border-[#d8ff35] hover:text-[#d8ff35]",
    liked: "border-[#d8ff35] bg-[#d8ff35] text-[#0e2238] hover:bg-[#c6f20b]",
    divider: "border-white/15",
    author: "text-slate-300",
    authorName: "text-white",
    avatar: "bg-[#d8ff35] text-[#0e2238]",
    note: "text-slate-400",
  },
} as const;

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "S"
  );
}

/** Nothing to subscribe to — these values are read once, after hydration. */
const noSubscribe = () => () => {};

export default function PostActions({ slug, likes, author, tone = "light" }: PostActionsProps) {
  const c = palette[tone];
  const [count, setCount] = useState(likes);
  const [justLiked, setJustLiked] = useState(false);
  const [shareNote, setShareNote] = useState("");

  // Read through useSyncExternalStore rather than an effect: both are
  // browser-only, and the server snapshot is the empty/false case that the
  // markup hydrates from.
  const url = useSyncExternalStore(
    noSubscribe,
    () => window.location.href,
    () => "",
  );
  const storedLike = useSyncExternalStore(
    noSubscribe,
    () => {
      try {
        return window.localStorage.getItem(`sinag:liked:${slug}`) === "1";
      } catch {
        return false;
      }
    },
    () => false,
  );

  // storedLike does not update after we write to localStorage — nothing is
  // subscribed — so the click this session is tracked separately.
  const liked = justLiked || storedLike;

  const like = async () => {
    if (liked) return;
    // Optimistic: the request is idempotent, so the worst a failure costs is a
    // number that corrects itself on the next load.
    setJustLiked(true);
    setCount((n) => n + 1);
    try {
      window.localStorage.setItem(`sinag:liked:${slug}`, "1");
    } catch {}

    try {
      const response = await fetch("/api/news/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (response.ok) {
        const payload = await response.json();
        if (typeof payload.likes === "number") setCount(payload.likes);
      }
    } catch {
      /* keep the optimistic count; a reload shows the truth */
    }
  };

  const share = async () => {
    const href = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: href });
        return;
      } catch {
        /* dismissed — fall through to copying */
      }
    }
    try {
      await navigator.clipboard.writeText(href);
      setShareNote("Link copied.");
    } catch {
      setShareNote("Copy the address from the bar above.");
    }
    window.setTimeout(() => setShareNote(""), 2500);
  };

  const encoded = encodeURIComponent(url);

  return (
    <div className={`mt-14 border-t pt-8 ${c.divider}`}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`type-kicker font-semibold uppercase tracking-[0.14em] ${c.label}`}>
            Share this
          </span>

          <button
            type="button"
            onClick={share}
            className={`type-body-sm inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold transition ${c.button}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 15V3m0 0L8 7m4-4 4 4"
              />
            </svg>
            Share
          </button>

          {[
            {
              label: "LinkedIn",
              href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
              d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05A4.2 4.2 0 0 1 17.6 8.7c4 0 4.7 2.5 4.7 5.8V21h-4v-5.6c0-1.35-.02-3.1-1.9-3.1s-2.2 1.48-2.2 3v5.7h-4V9Z",
            },
            {
              label: "X",
              href: `https://twitter.com/intent/tweet?url=${encoded}`,
              d: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z",
            },
            {
              label: "Facebook",
              href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
              d: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.55.45-1 1-1Z",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${item.label}`}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${c.button}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path fill="currentColor" d={item.d} />
              </svg>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={like}
          aria-pressed={liked}
          className={`type-body-sm inline-flex items-center gap-2 rounded-full border px-5 py-2 font-semibold transition ${
            liked ? c.liked : c.button
          }`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <path
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z"
            />
          </svg>
          {liked ? "Liked" : "Like"}
          <span className="tabular-nums">{count}</span>
        </button>
      </div>

      {shareNote && <p className={`type-kicker mt-3 ${c.note}`}>{shareNote}</p>}

      <div className={`mt-8 flex items-center gap-4 border-t pt-8 ${c.divider}`}>
        <span
          aria-hidden="true"
          className={`type-body-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold ${c.avatar}`}
        >
          {initials(author || "Sinag Global Energy")}
        </span>
        <div>
          <p className={`type-kicker uppercase tracking-[0.14em] ${c.label}`}>Written by</p>
          <p className={`type-body font-semibold ${c.authorName}`}>
            {author || "Sinag Global Energy"}
          </p>
        </div>
      </div>
    </div>
  );
}
