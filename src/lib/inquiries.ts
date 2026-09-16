import { promises as fs } from "node:fs";
import path from "node:path";

export type Inquiry = {
  id: string;
  receivedAt: string;
  name: string;
  company: string;
  email: string;
  contact: string;
  message: string;
};

/**
 * Inquiries land in a JSON file on disk. That works on the VM, where the
 * filesystem persists; it does NOT work on Vercel, whose filesystem is
 * read-only and ephemeral. Moving off the VM means moving this to a database.
 */
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

export async function readInquiries(): Promise<Inquiry[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Inquiry[]) : [];
  } catch {
    return [];
  }
}

export async function appendInquiry(entry: Inquiry): Promise<void> {
  await serialise(async () => {
    const all = await readInquiries();
    all.push(entry);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf8");
  });
}

export const COOLDOWN_MS = 5 * 60 * 1000;
