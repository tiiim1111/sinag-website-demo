# CLAUDE.md

Marketing site for **Sinag Global Energy Corp.** — a Philippine clean-energy company whose
product is the **EER-SPG** (Electromagnetic Energy-Flux Reactor — Stationary Power Generator),
positioned as clean, on-demand baseload generation without fuel, feedstock, or weather dependency.

This is a **content/design-led marketing site**, not an app. There is no database, no API layer,
and no auth. Most work here is copy, layout, and motion.

## Commands

```bash
npm run dev     # next dev — http://localhost:3000
npm run build   # production build; run this before pushing
npm run lint    # eslint (flat config, eslint-config-next)
```

No test suite and no CI. `npm run build` is the only gate.

## Stack

- **Next.js 16 (App Router)** + React 19 — server components by default
- **Tailwind CSS v4**, CSS-first config. There is **no `tailwind.config.js`**; theme lives in
  `@theme inline` inside `src/app/globals.css`
- **Fonts:** Inter (`--font-inter`, body) and Oswald (`--font-display`, condensed headlines) via
  `next/font/google`, wired in `src/app/layout.tsx`
- **Deploy:** Vercel, project `sinag-site-demo`, from `master`

## Structure

```
src/app/
  layout.tsx              fonts + root metadata (only metadata in the whole site)
  globals.css             design tokens, type scale, animation classes
  page.tsx                Home — hero, scientific shift, energy challenge, what we built,
                          why now, closing full-bleed CTA band
  about-us/               company story, leadership cards, Gem Power panel
  our-system/             how the EER works (Faraday's law framing), application fit
  latest/                 newsroom — 2 hardcoded posts
  investors-portal/       password gate (UI only, no backend)
src/components/
  site-shell.tsx          nav + footer wrapper — every page must render inside this.
                          Holds navItems, footerColumns and socials as module-level arrays
  parallax-hero.tsx       3-video autoplay carousel, 9s rotation, scroll parallax
  scientific-shift-section.tsx   scroll-progress-driven reveal (inline transforms)
  scroll-reveal.tsx       IntersectionObserver wrapper for section reveals
```

**Every page wraps its content in `<SiteShell>`.** Nav links live in the `navItems` array in
`site-shell.tsx` — adding a route means adding it there, and usually to `footerColumns` too.

The footer deep-links into page sections by anchor: `#challenge`, `#overview`, `#why-now` on the
homepage and `#leadership` on About Us. Those ids carry a `scroll-mt-*` so the fixed header does
not cover the heading — **keep the id and the scroll offset together** if you move a section.

## Design system

Tokens are CSS custom properties in `globals.css`, exposed to Tailwind via `var(--token)` in
arbitrary values (e.g. `text-[var(--brand-dark)]`).

| Token | Value | Use |
|---|---|---|
| `--brand` | `#007e8a` | teal, buttons/CTAs |
| `--brand-dark` | `#0c2f57` | navy, headings and dark panels |
| `--accent` | `#11b39a` | green, kickers |
| `--line` | `#cfdee8` | all borders (`.thin-border`) |
| `--background` | `#f3f7fa` | page ground |

**Colors used on the homepage that are NOT tokens yet** — hardcoded hex, keep them consistent
if you touch these sections: `#8fdb3d` (lime, dark "Overview" sections), `#d8ff35` (hero
yellow-green CTA + nav underline), `#0b7f8f` (challenge card icons), `#eef4f7` / `#14191b` /
`#f8f7f1` (section grounds).

**Type scale** — always use these classes, never raw `text-*` sizes for body/headings. All are
fluid `clamp()` values, so they need no responsive variants:

`.type-kicker` · `.type-body-sm` · `.type-body` · `.type-body-lg` · `.type-emphasis` ·
`.type-title` · `.type-display`

The scale is a **golden-ratio ladder** anchored on `.type-body` (1rem at 375px → 1.125rem at
1440px). Steps are φ (1.618), √φ (1.272), or φ^¼ (1.128) — never an arbitrary number. On mobile
every step is √φ or tighter; on desktop the display tier (emphasis → title → display) opens up
to a full φ per step, so headlines gain presence at width without body copy leaving the scale.

**If you add a size, derive it from an existing token by φ, √φ, or φ^¼ — do not invent one.**
The derivations are written out in the comment above the tokens in `globals.css`; update that
comment if you change the ladder.

`.display-condensed` switches to Oswald — used only for the hero headline.

**Motion:** wrap a section child in `<ScrollReveal>` and stagger siblings with
`delayClassName="delay-1"` / `"delay-2"`. The `.scroll-reveal` / `.is-visible` pair in
globals.css does the actual transition.

**Card hover:** every card carries `.card-lift`, which lifts it 6px and scales it to 1.025.
Pair it with a Tailwind `hover:` class for the surface — a stronger shadow and accent border on
light cards, a brighter border and background on dark ones. Cards with a photo also get `group`
on the article and `.card-zoom` on the `<Image>`, which scales the photo to 1.08 inside its
`overflow-hidden` frame. Both effects are disabled under `prefers-reduced-motion`.

Two gotchas:
- The homepage challenge cards use `clip-path`, which clips their box-shadow away. The lift and
  the border colour carry the hover there; do not expect a shadow to show.
- If a card's own transform is driven by an inline `style` (the scientific-shift cards are), the
  inline value wins over `.card-lift:hover`. Put the scroll transform on a wrapper `<div>` and
  leave the article free for hover — that section is already structured this way.

## Content source of truth

The company deck is `gemcor-presentation.pptx` (60 slides) at the repo root, **gitignored** along
with its `.zip` and the unpacked `gemcor-presentation-extract/` — 30MB of binaries kept local only.

The slides are **image-only**: `ppt/slides/*.xml` contain zero text runs, and all content is 52
full-slide PNGs in `gemcor-presentation-extract/ppt/media/`. To pull copy or layout ideas from the
deck you must **read the PNGs visually** — grepping the XML returns nothing.

Copy currently on the site is derived from that deck plus the existing sinagglobal.com and
gempowerph.com public pages.

### Writing copy for this site

- Claims stay at the level the deck makes them — "positioned as", "designed for", "aims to".
  Do not invent performance figures, certifications, capacities, or customer names.
- Apostrophes: in **JSX text** use `&apos;`; in **JS string literals** (card/post arrays) use a
  real `’` character. Mixing these up renders the entity literally on screen.

## Assets

- `public/1.mp4` `2.mp4` `3.mp4` — hero videos, **32MB total, committed**. All three autoplay
  simultaneously. This is the site's biggest performance liability; compress or lazy-load before
  any real launch.
- `public/logo.png` — Gem Power Philippines Corp. lockup (2000×357, alpha). Used in the header,
  the footer, and the About Us panel. Source drop lives in the gitignored `Logos/` folder.
- `public/logo-mark.png` — the mark alone (582×357, alpha). Currently unused; it is the obvious
  candidate if you add a favicon.
- `public/sinag-logo.svg` — the older Sinag Global wordmark the header used before the Gem Power
  lockup replaced it. Kept in case the branding reverts.
- `public/team/*.png` — leadership headshots
- `public/overview/eer.png` — EER-SPG container render (homepage)
- `public/overview/picture1.png` — currently unused
- `public/cta/power-the-future.jpg` — **placeholder** behind the homepage closing CTA band.
  CC0 via Openverse, no attribution required, but only 853px wide so it is soft at desktop
  widths. Drop the final art at the same path to swap it; no code change needed. The band
  layers two overlays over it — a flat tint plus a directional gradient that runs top-down
  below `lg` and left-to-right above it — so the white headline stays legible whatever the
  photo crops to.
- `public/{next,vercel,window,file,globe}.svg` — create-next-app leftovers, unused
- `resources/` — gitignored duplicate of the hero videos

## Known gaps

Things that are deliberately unfinished — don't "fix" them silently, they need product decisions:

- **Search button** in the nav (`site-shell.tsx`) is decorative — no handler, no search backend.
- **Investors portal** password form is UI only — `type="button"`, no handler, no auth.
- **SEO:** only `layout.tsx` sets metadata. No per-page titles, no OG images, no favicon.
- **A11y:** no `prefers-reduced-motion` guard on the parallax, video autoplay, or reveals.
- `ScrollReveal` re-hides on scroll-out (it tracks `isIntersecting` both ways) rather than
  revealing once.
- `next.config.ts` allows remote images from `gempowerph.com` — no longer referenced anywhere.
- The challenge-card markup in `page.tsx` is duplicated across the top and bottom rows.
