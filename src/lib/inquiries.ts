import { promises as fs } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

export type Inquiry = {
  id: string;
  receivedAt: string;
  name: string;
  company: string;
  email: string;
  contact: string;
  message: string;
};

export const COOLDOWN_MS = 5 * 60 * 1000;

/**
 * Two backends, chosen by whether a database URL is present.
 *
 * **Postgres** when `DATABASE_URL` (or Vercel's `POSTGRES_URL`) is set. This is
 * the only option that works on Vercel, whose filesystem is read-only and whose
 * functions do not share memory — a file write is lost and an in-process
 * cooldown counter never sees the previous request.
 *
 * **JSON file** otherwise, so `npm run dev` needs no database at all.
 *
 * Point the VM at the same DATABASE_URL and both hosts share one inbox. Leave
 * it unset there and the VM keeps its own local file — which is a separate
 * inbox, so pick one deliberately rather than by accident.
 */
const DATABASE_URL = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";

export function storageBackend(): "postgres" | "file" {
  return DATABASE_URL ? "postgres" : "file";
}

/* ------------------------------------------------------------------ postgres */

const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// DDL runs once per process, not per request.
let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!sql) throw new Error("no database configured");
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id          uuid PRIMARY KEY,
        received_at timestamptz NOT NULL DEFAULT now(),
        name        text NOT NULL,
        company     text NOT NULL DEFAULT '',
        email       text NOT NULL,
        contact     text NOT NULL DEFAULT '',
        message     text NOT NULL
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS inquiry_throttle (
        ip      text PRIMARY KEY,
        last_at timestamptz NOT NULL
      )
    `;
  })();
  return schemaReady;
}

/* ---------------------------------------------------------------------- file */

const FILE = process.env.INQUIRIES_FILE
  ? path.resolve(process.env.INQUIRIES_FILE)
  : path.join(process.cwd(), "data", "inquiries.json");

// Read-modify-write is not atomic, so two submissions landing in the same tick
// would clobber each other. Chain them instead.
let queue: Promise<unknown> = Promise.resolve();

function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readFileInquiries(): Promise<Inquiry[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Inquiry[]) : [];
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------- public */

export async function readInquiries(): Promise<Inquiry[]> {
  if (!sql) return readFileInquiries();

  await ensureSchema();
  const rows = await sql`
    SELECT id, received_at, name, company, email, contact, message
    FROM inquiries
    ORDER BY received_at ASC
  `;
  return rows.map((row) => ({
    id: String(row.id),
    receivedAt: new Date(row.received_at as string).toISOString(),
    name: String(row.name),
    company: String(row.company),
    email: String(row.email),
    contact: String(row.contact),
    message: String(row.message),
  }));
}

export async function appendInquiry(entry: Inquiry): Promise<void> {
  if (!sql) {
    await serialise(async () => {
      const all = await readFileInquiries();
      all.push(entry);
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf8");
    });
    return;
  }

  await ensureSchema();
  await sql`
    INSERT INTO inquiries (id, received_at, name, company, email, contact, message)
    VALUES (${entry.id}, ${entry.receivedAt}, ${entry.name}, ${entry.company},
            ${entry.email}, ${entry.contact}, ${entry.message})
  `;
}

/* ------------------------------------------------------------------ throttle */

// Only used by the file backend. On Vercel this would be useless: every
// invocation can be a fresh isolate, so the map is empty more often than not.
const lastSeen = new Map<string, number>();

/**
 * Records the attempt and reports whether it is allowed. Returns the seconds
 * left when it is not.
 */
export async function claimSubmissionSlot(
  ip: string,
): Promise<{ allowed: true } | { allowed: false; retryAfter: number }> {
  if (!sql) {
    const now = Date.now();
    const previous = lastSeen.get(ip);
    if (previous !== undefined && now - previous < COOLDOWN_MS) {
      return { allowed: false, retryAfter: Math.ceil((COOLDOWN_MS - (now - previous)) / 1000) };
    }
    lastSeen.set(ip, now);
    return { allowed: true };
  }

  await ensureSchema();
  const seconds = Math.floor(COOLDOWN_MS / 1000);
  // One statement decides and records. Doing it as a read then a write would
  // let two requests arriving together both pass.
  const rows = await sql`
    INSERT INTO inquiry_throttle (ip, last_at)
    VALUES (${ip}, now())
    ON CONFLICT (ip) DO UPDATE
      SET last_at = now()
      WHERE inquiry_throttle.last_at < now() - make_interval(secs => ${seconds})
    RETURNING ip
  `;

  if (rows.length > 0) return { allowed: true };

  const [current] = await sql`
    SELECT EXTRACT(EPOCH FROM (last_at + make_interval(secs => ${seconds}) - now())) AS remaining
    FROM inquiry_throttle
    WHERE ip = ${ip}
  `;
  const remaining = Math.ceil(Number(current?.remaining ?? seconds));
  return { allowed: false, retryAfter: Math.max(1, remaining) };
}
