import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Shared password gate for the two unlinked admin pages: the inquiries inbox
 * and the newsroom editor.
 *
 * Both fail closed. When the environment variable is unset there is no token to
 * match, so nothing is shown and nothing can be saved — an unconfigured deploy
 * is locked, not open.
 *
 * They deliberately use different passwords and different cookies. Reading
 * contact details and publishing to the public site are not the same risk, so
 * one leaking should not hand over the other.
 */

/** sha256 of the password, or null when it is unset. */
export function expectedToken(password: string | undefined): string | null {
  if (!password) return null;
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function hashPassword(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Constant-time compare, so a wrong guess does not leak how close it was. */
export function sameToken(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export const INBOX_COOKIE = "sinag_inbox";
export const NEWSROOM_COOKIE = "sinag_newsroom";

export function newsroomToken(): string | null {
  return expectedToken(process.env.NEWSROOM_PASSWORD);
}

/**
 * Guard for every newsroom write. The editor page checks this to decide what to
 * render; the API routes check it again, because the page check only controls
 * what is drawn and anyone can call the route directly.
 */
export async function newsroomAuthorised(): Promise<boolean> {
  const token = newsroomToken();
  if (!token) return false;
  const value = (await cookies()).get(NEWSROOM_COOKIE)?.value;
  return typeof value === "string" && sameToken(value, token);
}
