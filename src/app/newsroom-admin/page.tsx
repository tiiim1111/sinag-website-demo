import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewsEditor from "@/components/news-editor";
import { NEWSROOM_COOKIE, hashPassword, newsroomToken, sameToken } from "@/lib/gate";
import { readPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsroom",
  // Unlisted is not the protection — the password is — but there is no reason
  // to let a crawler index the editor either.
  robots: { index: false, follow: false },
};

async function signIn(formData: FormData) {
  "use server";
  const token = newsroomToken();
  const submitted = hashPassword(String(formData.get("password") ?? ""));

  if (token && sameToken(submitted, token)) {
    const store = await cookies();
    store.set(NEWSROOM_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    redirect("/newsroom-admin");
  }

  redirect("/newsroom-admin?error=1");
}

async function signOut() {
  "use server";
  const store = await cookies();
  store.delete(NEWSROOM_COOKIE);
  redirect("/newsroom-admin");
}

/** Teal ground shared by all three states, matching the inbox and About Us. */
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

export default async function NewsroomAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const token = newsroomToken();
  const { error } = await searchParams;

  if (!token) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg rounded-[1.5rem] border border-[#d8ff35]/40 bg-white/[0.06] p-10 backdrop-blur-sm">
          <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#d8ff35]">
            Not configured
          </p>
          <h1 className="type-emphasis mt-3 font-semibold text-white">The newsroom is closed</h1>
          <p className="type-body-sm mt-4 text-slate-300">
            Set{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-[#d8ff35]">
              NEWSROOM_PASSWORD
            </code>{" "}
            in the server environment and restart. Until then nothing here can be opened or saved
            &mdash; it fails closed rather than leaving the site editable.
          </p>
        </div>
      </Shell>
    );
  }

  const store = await cookies();
  const authorised = store.get(NEWSROOM_COOKIE)?.value === token;

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
            <h1 className="type-emphasis mt-3 font-semibold text-white">Newsroom</h1>
            <p className="type-body-sm mt-3 text-slate-300">
              Anything written here goes out on the public site. Enter the password to open it.
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
                Open newsroom
              </button>
            </form>
          </div>
        </div>
      </Shell>
    );
  }

  const posts = await readPosts();

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-center justify-end gap-4">
        <form action={signOut}>
          <button
            type="submit"
            className="type-body-sm rounded-full border border-white/25 px-5 py-2 font-semibold text-white transition hover:border-[#d8ff35] hover:text-[#d8ff35]"
          >
            Sign out
          </button>
        </form>
      </div>

      <NewsEditor initialPosts={posts} />
    </Shell>
  );
}
