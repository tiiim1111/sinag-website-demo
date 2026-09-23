import { NextResponse } from "next/server";
import { newsroomAuthorised } from "@/lib/gate";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, saveMedia } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Image upload for the editor. Gated, because an open upload endpoint is a free
 * file host for anyone who finds it.
 */
export async function POST(request: Request) {
  if (!(await newsroomAuthorised())) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was sent." }, { status: 400 });
  }

  const type = file.type.toLowerCase();
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json(
      { error: "That file type is not supported. Use PNG, JPEG, WebP, GIF or AVIF." },
      { status: 415 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // Checked on the bytes, not on the declared size — the header is the client's
  // claim and this is the thing actually being stored.
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: `That image is over ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB.` },
      { status: 413 },
    );
  }
  if (bytes.byteLength === 0) {
    return NextResponse.json({ error: "That file is empty." }, { status: 400 });
  }

  const id = await saveMedia(type, bytes);
  return NextResponse.json({ ok: true, mediaId: id, url: `/api/news/media/${id}` });
}
