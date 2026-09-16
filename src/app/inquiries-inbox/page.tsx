import type { Metadata } from "next";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readInquiries } from "@/lib/inquiries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inquiries inbox",
  // Unlisted is not protection on its own, but there is no reason to let a
  // crawler index a page holding people's contact details.
  robots: { index: false, follow: false },
};

const COOKIE = "sinag_inbox";

/** sha256 of INQUIRIES_PASSWORD, or null when the env var is unset. */
function expectedToken(): string | null {
  const password = process.env.INQUIRIES_PASSWORD;
  if (!password) return null;
  return crypto.createHash("sha256").update(password).digest("hex");
}

function sameToken(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

async function signIn(formData: FormData) {
  "use server";
  const token = expectedToken();
  const submitted = crypto
    .createHash("sha256")
    .update(String(formData.get("password") ?? ""))
    .digest("hex");

  if (token && sameToken(submitted, token)) {
    const store = await cookies();
    store.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    redirect("/inquiries-inbox");
  }

  redirect("/inquiries-inbox?error=1");
}

async function signOut() {
  "use server";
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/inquiries-inbox");
}

export default async function InquiriesInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const token = expectedToken();
  const { error } = await searchParams;

  if (!token) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="type-title font-semibold text-[var(--brand-dark)]">Inbox not configured</h1>
        <p className="type-body mt-4 text-slate-700">
          Set <code className="rounded bg-slate-100 px-1.5 py-0.5">INQUIRIES_PASSWORD</code> in the
          server environment and restart. Until then this page shows nothing — it fails closed rather
          than exposing contact details.
        </p>
      </main>
    );
  }

  const store = await cookies();
  const authorised = store.get(COOKIE)?.value === token;

  if (!authorised) {
    return (
      <main className="mx-auto max-w-md px-6 py-24">
        <h1 className="type-title font-semibold text-[var(--brand-dark)]">Inquiries inbox</h1>
        <form action={signIn} className="mt-8">
          <label className="type-body-sm font-semibold text-[var(--brand-dark)]" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="type-body-sm mt-2 w-full rounded-lg border border-[var(--line)] px-4 py-3 focus:border-[var(--brand)] focus:outline-none"
          />
          {error && <p className="type-kicker mt-2 text-red-600">That password did not match.</p>}
          <button
            type="submit"
            className="type-body mt-5 w-full rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--brand-dark)]"
          >
            Open inbox
          </button>
        </form>
      </main>
    );
  }

  const inquiries = (await readInquiries()).slice().reverse();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="type-title font-semibold text-[var(--brand-dark)]">Inquiries</h1>
        <form action={signOut}>
          <button type="submit" className="type-body-sm text-slate-500 underline">
            Sign out
          </button>
        </form>
      </div>
      <p className="type-body-sm mt-2 text-slate-600">
        {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}, newest first.
      </p>

      {inquiries.length === 0 ? (
        <p className="type-body mt-10 text-slate-500">Nothing has come in yet.</p>
      ) : (
        <ul className="mt-8 space-y-5">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              className="rounded-2xl border border-[var(--line)] bg-white px-7 py-6 shadow-[0_10px_24px_rgba(12,47,87,0.05)]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="type-body font-semibold text-[var(--brand-dark)]">
                  {inquiry.name}
                  {inquiry.company && (
                    <span className="font-normal text-slate-500"> · {inquiry.company}</span>
                  )}
                </p>
                <time className="type-kicker text-slate-500" dateTime={inquiry.receivedAt}>
                  {new Date(inquiry.receivedAt).toLocaleString()}
                </time>
              </div>
              <p className="type-body-sm mt-2 text-slate-600">
                <a href={`mailto:${inquiry.email}`} className="text-[#0a745f] underline">
                  {inquiry.email}
                </a>
                {inquiry.contact && (
                  <>
                    {" · "}
                    <a href={`tel:${inquiry.contact}`} className="text-[#0a745f] underline">
                      {inquiry.contact}
                    </a>
                  </>
                )}
              </p>
              <p className="type-body mt-4 whitespace-pre-wrap text-slate-700">{inquiry.message}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
