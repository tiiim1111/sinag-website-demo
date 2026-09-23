import { readMedia } from "@/lib/posts";

export const runtime = "nodejs";

/**
 * Serves an uploaded image. Public — these sit in published posts.
 *
 * A media id is never reused, so the bytes behind a URL cannot change and the
 * response is immutable for a year. That matters more than usual here: the
 * image comes out of the database, so every uncached hit is a query.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await readMedia(id);
  if (!media) return new Response("Not found", { status: 404 });

  const bytes = Buffer.from(media.data, "base64");
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": media.contentType,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
