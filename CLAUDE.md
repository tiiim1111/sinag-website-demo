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
  about-us/               "What We Stand For" statement, the leadership block, then the
                          patent portfolio. No hero, and the 2014/EER founding copy was
                          cut on purpose
  our-system/             three tabbed sections and nothing else: Energy Challenge (3
                          chapters), Solution (5), Technology (4), chained through nested
                          ScrollStacks. No hero — the challenge rail is it
  latest/                 newsroom — 2 hardcoded posts
  investors-portal/       password gate (UI only, no backend)
src/components/
  site-shell.tsx          nav + footer wrapper — every page must render inside this.
                          Holds navItems, footerColumns and socials as module-level arrays
  parallax-hero.tsx       3-video autoplay carousel, 9s rotation, scroll parallax
  scientific-shift-section.tsx   scroll-progress-driven reveal (inline transforms)
  chapter-tabs.tsx        the numbered tab rail + panel shell both tabbed sections use.
                          The ONLY client component of the three — panels arrive as
                          already-rendered ReactNode, so the sections below stay server
                          components and every chapter's copy ships in the HTML
  energy-challenge-section.tsx   "The Energy Challenge" — rendered on BOTH the homepage
                          and Our System, so edits to it show up in two places. Two props:
                          `tabbed` splits it into three chapters behind the rail (Our
                          System only — the homepage shows just the first, no tabs), and
                          `asPageOpener` adds the top padding that clears the fixed header
  solution-section.tsx    "GEMCOR's Solution: EER-SPG" — 5 chapters. Our System only
  technology-section.tsx  "Technology" — 4 reactor chapters. Our System only
  panel-heading.tsx       chapter panel h2 — left-aligned while its copy is centred
  scroll-reveal.tsx       IntersectionObserver wrapper for section reveals
  parallax-layer.tsx      drifts a decorative layer against the scroll
  scroll-stack.tsx        pins one section while the next scrolls up over it
```

**The header is `fixed` and transparent at rest, so it neither reserves space nor has a
background of its own.** Two consequences for any new page:

- It does not reserve space. Only the homepage hero is meant to run underneath it; every other
  page's first section needs `pt-32` to clear it, or the kicker renders behind the logo.
- Its links are white until you scroll past 120px, which only reads over a dark hero. A page
  that opens on a light background must pass `<SiteShell solidHeader>` — otherwise the nav is
  white on near-white. Home, About Us and Our System all open on a dark band and do not need it;
  Latest and Investors Portal do.

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

**Parallax:** wrap a decorative layer in `<ParallaxLayer>` to drift it against the scroll. Give
the wrapper more room than it needs (`-inset-y-16` on the chapter grids) — the transform does not
move the layout box, so the drift would otherwise expose an edge. Inert under reduced motion.
Consecutive `ChapterTabs` pass `overlapPrevious` so the next section rides up over the last one
with a rounded lip and a cast shadow.

**Equal-height chapters:** every panel in a `ChapterTabs` sits in the same CSS grid cell
(`col-start-1 row-start-1`), so the section is always as tall as its longest chapter and
switching tabs never resizes it. Inactive panels are `invisible`, **not** the `hidden`
attribute — `hidden` pulls the box out of layout, which is what made the height jump.
Visibility still removes them from the a11y tree, tab order and pointer events. The constant
height also keeps a `ScrollStack` pin stable, since its trigger is derived from section height.

**Sticky chapter rail:** the `ChapterTabs` rail is `sticky top-0` so the tabs stay reachable while
you read a chapter. Two things keep that working, both easy to undo by accident:

- The section must NOT have `overflow-hidden` — that makes it a scroll container and the rail
  stops sticking. The overlap lip and shadow therefore live on the rail itself, not the section.
- Inside a `ScrollStack` the rail carries `translateY(calc(var(--pin-offset) * -2))`. The parent
  shifts down by `--pin-offset` during a pin, so the net `-1x` slides the rail up and away —
  without it two chapter rails sit stacked on top of each other through the whole transition.

The rail's top padding also has to clear the fixed site header (z-30, above the rail's z-20),
so it cannot go below about `pt-20`.

**Pinned stack:** `<ScrollStack pinned={…}>` holds a section still while the next scrolls up over
it — Our System uses it for Challenge → Solution. **Do not try to rebuild this with
`position: sticky`.** A sticky box taller than the viewport can never satisfy a `bottom: 0`
constraint, so the browser leaves it in flow and nothing happens; `sticky top: 0` pins the wrong
edge and buries everything below the fold. ScrollStack translates the pinned section down by the
distance scrolled instead, which freezes it visually without touching layout.

A pinned section pins the moment its bottom meets the bottom of the viewport, so free scroll
before the trigger is only `sectionHeight - viewportHeight`. Pass `trailingSpace` to its
`ChapterTabs` to buy room — without it the challenge fired after ~98px and was covered before it
could be read. **Every pinned section needs it.**

Nest ScrollStacks to chain handoffs (Challenge → Solution → Technology). Nesting works because
only the `pinned` child is transformed, never the children, so an inner stack still measures off
an untransformed container. The last section in the chain is not pinned and needs no
`trailingSpace`.

A pinned section **keeps its downward translate after the handoff** — it ends up sitting up to a
full viewport lower than its layout box, spilling over whatever follows. Its wrapper is
`relative z-0`, and a positioned element outranks a static one in paint order regardless of
z-index, so it painted straight over the footer. The footer therefore carries `relative z-20`.
**Do not fix a spill like this with `overflow-hidden`** on the stack — that would make it a
scroll container and kill the sticky rails.

**Tailwind gotcha:** `shadow-[…]` silently drops an arbitrary value whose first offset is
negative — the rule compiles but computes to transparent. Use the arbitrary *property* form,
`[box-shadow:0_-26px_60px_…]`, for upward shadows.

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
- `public/patents/*.png` — the nine patent certificate scans, portrait, ~3:4
- `public/overview/eer.png` — EER-SPG container render (homepage)
- `public/overview/picture1.png` — currently unused
- `public/cta/power-the-future.png` — GEMCOR facility shot behind the homepage closing CTA band
  (1505×493). The band layers two overlays over it — a flat tint plus a directional gradient that
  runs top-down below `lg` and left-to-right above it — so the white headline stays legible
  whatever the photo crops to. They are tuned for this already-dark image; a brighter
  replacement would need them raised again.
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
- **Our System is still being built out from the deck**, one tabbed section per topic. Challenge
  and Solution are in; more may follow. There is no hero by design.
- **The Solution intro chapter reuses `/overview/eer.png`** (the single container unit). The deck
  also shows a stacked/scaled render on its first slide — that asset has not been supplied.
