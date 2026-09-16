import { NextResponse } from "next/server";
import { COOLDOWN_MS, appendInquiry } from "@/lib/inquiries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * In-memory cooldown: one submission per IP per 5 minutes. It resets on
 * restart and is per-process, which is fine for a single VM — a shared store
 * would be needed if this ever runs on more than one instance.
 */
const lastSeen = new Map<string, number>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const now = Date.now();
  const previous = lastSeen.get(ip);

  if (previous !== undefined && now - previous < COOLDOWN_MS) {
    const retryAfter = Math.ceil((COOLDOWN_MS - (now - previous)) / 1000);
    return NextResponse.json(
      { error: "cooldown", retryAfter },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;

  // Hidden field a person never sees. Anything in it is a bot; accept without
  // storing so it does not retry.
  if (field(raw.website, 100)) return NextResponse.json({ ok: true });

  const name = field(raw.name, 120);
  const company = field(raw.company, 160);
  const email = field(raw.email, 200);
  const contact = field(raw.contact, 60);
  const message = field(raw.message, 4000);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please tell us your name.";
  if (!email) errors.email = "Please give us an email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "That email does not look right.";
  if (!message) errors.message = "Please tell us what you need.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  await appendInquiry({
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    name,
    company,
    email,
    contact,
    message,
  });

  lastSeen.set(ip, now);
  return NextResponse.json({ ok: true });
}
