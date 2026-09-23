import { NextResponse } from "next/server";
import { likePost } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public, and deliberately modest: one like per IP per post, enforced by a
 * primary key rather than by trusting the caller. Behind a proxy this reads
 * `x-forwarded-for`, the same header the inquiry rate limit needs — if nginx
 * does not set it, every visitor is one IP and a post can only ever reach one
 * like.
 *
 * This is not spoof-proof and is not meant to be. It is a marketing-site like
 * button, not a vote.
 */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }

  const slug = (body as Record<string, unknown>).slug;
  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ error: "missing slug" }, { status: 400 });
  }

  const result = await likePost(slug.slice(0, 80), clientIp(request));
  if (!result) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json(result);
}
