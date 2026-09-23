import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { INBOX_COOKIE, expectedToken, hashPassword, sameToken } from "@/lib/gate";
import { readInquiries, type Inquiry } from "@/lib/inquiries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inquiries inbox",
  // Unlisted is not protection on its own, but there is no reason to let a
  // crawler index a page holding contact details people sent us.
  robots: { index: false, follow: false },
};

async function signIn(formData: FormData) {
  "use server";
  const token = expectedToken(process.env.INQUIRIES_PASSWORD);
  const submitted = hashPassword(String(formData.get("password") ?? ""));

  if (token && sameToken(submitted, token)) {
    const store = await cookies();
    store.set(INBOX_COOKIE, token, {
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
  store.delete(INBOX_COOKIE);
  redirect("/inquiries-inbox");
}

/** Teal ground shared by all three states, matching Inquiries and About Us. */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04383f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(216,255,53,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(216,255,53,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#d8ff35]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-0 h-96 w-96 rounded-full bg-cyan-400/8 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-16">{children}</div>
    </main>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const received = new Date(inquiry.receivedAt);
  return (
    <li className="rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm transition hover:border-[#d8ff35]/40 hover:bg-white/[0.09] md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="type-body-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d8ff35] font-semibold text-[#0e2238]"
          >
            {initials(inquiry.name)}
          </span>
          <div>
            <p className="type-body font-semibold text-white">{inquiry.name}</p>
            {inquiry.company && <p className="type-body-sm text-slate-400">{inquiry.company}</p>}
          </div>
        </div>
        <time className="type-kicker whitespace-nowrap text-slate-400" dateTime={inquiry.receivedAt}>
          {received.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {" at "}
          {received.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
        </time>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={`mailto:${inquiry.email}`}
          className="type-kicker rounded-full border border-white/20 px-4 py-2 font-semibold text-white transition hover:border-[#d8ff35] hover:text-[#d8ff35]"
        >
          {inquiry.email}
        </a>
        {inquiry.contact && (
          <a
            href={`tel:${inquiry.contact}`}
            className="type-kicker rounded-full border border-white/20 px-4 py-2 font-semibold text-white transition hover:border-[#d8ff35] hover:text-[#d8ff35]"
          >
            {inquiry.contact}
          </a>
        )}
      </div>

      <p className="type-body-sm mt-5 whitespace-pre-wrap rounded-xl bg-black/20 px-5 py-4 text-slate-200">
        {inquiry.message}
      </p>
    </li>
  );
}

export default async function InquiriesInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const token = expectedToken(process.env.INQUIRIES_PASSWORD);
  const { error } = await searchParams;

  if (!token) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg rounded-[1.5rem] border border-[#d8ff35]/40 bg-white/[0.06] p-10 backdrop-blur-sm">
          <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#d8ff35]">
            Not configured
          </p>
          <h1 className="type-emphasis mt-3 font-semibold text-white">The inbox is closed</h1>
          <p className="type-body-sm mt-4 text-slate-300">
            Set{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-[#d8ff35]">
              INQUIRIES_PASSWORD
            </code>{" "}
            in the server environment and restart. Until then this page shows nothing &mdash; it fails
            closed rather than exposing contact details.
          </p>
        </div>
      </Shell>
    );
  }

  const store = await cookies();
  const authorised = store.get(INBOX_COOKIE)?.value === token;

  if (!authorised) {
    return (
      <Shell>
        <div className="mx-auto mt-6 max-w-md">
          <Image
            src="/logo.png"
            alt="Gem Power Philippines Corp."
            width={2000}
            height={357}
            className="mx-auto h-auto w-[190px]"
          />
          <div className="mt-10 rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-8 backdrop-blur-sm">
            <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#d8ff35]">
              Restricted
            </p>
            <h1 className="type-emphasis mt-3 font-semibold text-white">Inquiries inbox</h1>
            <p className="type-body-sm mt-3 text-slate-300">
              This page holds contact details people sent us. Enter the password to open it.
            </p>

            <form action={signIn} className="mt-7">
              <label className="type-body-sm font-semibold text-white" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="type-body-sm mt-2 w-full rounded-lg border border-white/20 bg-black/25 px-4 py-3 text-white transition focus:border-[#d8ff35] focus:outline-none focus:ring-2 focus:ring-[#d8ff35]/25"
              />
              {error && <p className="type-kicker mt-2 text-red-400">That password did not match.</p>}
              <button
                type="submit"
                className="type-body mt-6 w-full rounded-full bg-[#d8ff35] px-6 py-3 font-semibold text-[#0e2238] transition hover:bg-[#c6f20b]"
              >
                Open inbox
              </button>
            </form>
          </div>
        </div>
      </Shell>
    );
  }

  const inquiries = (await readInquiries()).slice().reverse();

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#d8ff35]">Inbox</p>
          <h1 className="type-title mt-2 font-semibold tracking-tight text-white">Inquiries</h1>
          <p className="type-body-sm mt-2 text-slate-300">
            {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}, newest first.
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="type-body-sm rounded-full border border-white/25 px-5 py-2 font-semibold text-white transition hover:border-[#d8ff35] hover:text-[#d8ff35]"
          >
            Sign out
          </button>
        </form>
      </div>

      {inquiries.length === 0 ? (
        <div className="mt-12 rounded-[1.5rem] border border-dashed border-white/20 px-8 py-16 text-center">
          <p className="type-body font-semibold text-white">Nothing has come in yet.</p>
          <p className="type-body-sm mt-2 text-slate-400">
            Submissions from the Inquiries page will land here.
          </p>
        </div>
      ) : (
        <ul className="mt-10 space-y-5">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </ul>
      )}
    </Shell>
  );
}
