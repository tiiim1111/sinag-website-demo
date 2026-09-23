import { NextResponse } from "next/server";
import { appendInquiry, claimSubmissionSlot } from "@/lib/inquiries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;

  // Hidden field a person never sees. Anything in it is a bot; accept without
  // storing so it does not retry. Checked before the throttle so bots never
  // consume a real visitor's slot.
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

  // Validate before throttling, so a typo does not cost a five minute wait.
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const slot = await claimSubmissionSlot(clientIp(request));
  if (!slot.allowed) {
    return NextResponse.json(
      { error: "cooldown", retryAfter: slot.retryAfter },
      { status: 429, headers: { "Retry-After": String(slot.retryAfter) } },
    );
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

  return NextResponse.json({ ok: true });
}
