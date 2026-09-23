# Deploying on Vercel

The project is already linked to the Vercel project `sinag-site-demo` and
deploys from `master`. The marketing pages have worked there all along. What
did not, until now, is the inquiry pipeline — Vercel's filesystem is read-only
and its functions do not share memory, so a file write is lost and an
in-process cooldown counter never sees the previous request.

Storage now switches on whether a database URL is present:

| `DATABASE_URL` set | Storage | Cooldown |
|---|---|---|
| yes | Postgres | a row per IP, claimed in one statement |
| no  | `data/inquiries.json` | in-memory map |

Local `npm run dev` needs no database. Vercel needs one.

## 1. Create the database

In the Vercel dashboard, open the project → **Storage** → **Create Database** →
**Neon** (Postgres). Take the free plan and the region closest to Manila —
Singapore (`ap-southeast-1`) if it is offered.

Connect it to the project when prompted. Vercel injects `DATABASE_URL` into all
three environments; nothing to copy by hand.

The schema creates itself on the first request. There is no migration to run.

## 2. Set the two passwords

Project → **Settings** → **Environment Variables**:

| Name | Value | Environments |
|---|---|---|
| `INQUIRIES_PASSWORD` | something long | Production, Preview, Development |
| `NEWSROOM_PASSWORD` | something long, **different** | Production, Preview, Development |

Without the first, `/inquiries-inbox` shows "The inbox is closed" and no data.
Without the second, `/newsroom-admin` shows "The newsroom is closed" and cannot
save. Both are deliberate — they fail closed.

**Make all four different: two per host.** Reading contact details and
publishing to the public site are not the same risk, and the VM and Vercel are
two places a password can leak from.

## 3. Redeploy

Environment variables only reach a new build:

```bash
git push            # or hit Redeploy in the dashboard
```

## 4. Seed the newsroom

A fresh database has no posts, so `/latest` and the Home and About Us card
sections come up empty. The two 2021 posts that used to be hardcoded on
`/latest` go back in with:

```bash
node scripts/seed-news.mjs https://sinag-site-demo.vercel.app "<NEWSROOM_PASSWORD>"
```

It skips anything already published, so re-running is safe. Everything after
that is written at `/newsroom-admin`.

## 5. Check it

1. `/inquiries` — send a test submission
2. `/inquiries-inbox` — it should be there, and the line under the heading
   should read **"Stored in Postgres."** If it says "Stored in a local file",
   `DATABASE_URL` did not reach the running deployment
3. Submit again straight away — expect the five minute countdown
4. `/newsroom-admin` — sign in, and the line at the top should read
   **"Stored in Postgres."** Add a post with an image and check it appears on
   Home, About Us and `/latest`

## Running both Vercel and the VM

They are separate deployments. Whether they share an inbox is your choice:

- **Point the VM at the same `DATABASE_URL`** (put it in `.env.local` there) and
  both read and write one set of inquiries.
- **Leave the VM without it** and it keeps its own `data/inquiries.json`, which
  is a second, separate inbox.

Either is fine. Picking by accident is not — check the "Stored in…" line on
each host to see which one you are looking at.

The VM's existing `data/inquiries.json` does not migrate itself. To move those
rows into Postgres, insert them once by hand; there are only a handful.

## What does not carry over from the VM setup

`deploy/nginx-sinag.conf` and `ecosystem.config.cjs` are for the VM only.
Vercel terminates TLS, compresses, serves static assets from its CDN, and sets
`x-forwarded-for` itself. `next.config.ts` keeps `compress: false`, which is
correct on both — nginx compresses on the VM, Vercel's edge compresses there.
