import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { newsroomAuthorised } from "@/lib/gate";
import { deletePost, savePost } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Save or delete a post. Both are gated: the editor page decides what to draw,
 * but the gate has to be re-checked here because a route can be called
 * directly, without ever loading that page.
 */

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  if (!(await newsroomAuthorised())) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;

  const title = field(raw.title, 300);
  if (!title) {
    return NextResponse.json({ errors: { title: "A post needs a title." } }, { status: 422 });
  }

  const post = await savePost({
    id: typeof raw.id === "string" ? raw.id : undefined,
    title,
    date: field(raw.date, 10),
    author: field(raw.author, 160),
    excerpt: field(raw.excerpt, 600),
    blocks: raw.blocks,
    published: Boolean(raw.published),
  });

  // The public pages are cached server components; without this a save would
  // not show up on Home, About Us or Latest until the next deploy.
  revalidatePath("/");
  revalidatePath("/about-us");
  revalidatePath("/latest");
  revalidatePath(`/latest/${post.slug}`);

  return NextResponse.json({ ok: true, post });
}

export async function DELETE(request: Request) {
  if (!(await newsroomAuthorised())) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }
  const id = field((body as Record<string, unknown>).id, 40);
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  await deletePost(id);

  revalidatePath("/");
  revalidatePath("/about-us");
  revalidatePath("/latest");

  return NextResponse.json({ ok: true });
}
