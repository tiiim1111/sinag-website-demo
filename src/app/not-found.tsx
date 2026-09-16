import Link from "next/link";
import SiteShell from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-[#04383f]">
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
          className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-[#d8ff35]/10 blur-3xl"
        />

        <div className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-center px-6 pb-24 pt-32">
          <p className="display-condensed type-display font-semibold leading-none text-[#d8ff35]">404</p>
          <h1 className="type-title mt-6 max-w-3xl font-semibold tracking-tight text-white">
            That page is not here.
          </h1>
          <p className="type-body mt-5 max-w-xl text-slate-300">
            The link may be out of date, or the address may have a typo in it. Everything on the site is
            reachable from the pages below.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/"
              className="type-body inline-flex items-center rounded-full bg-[#d8ff35] px-7 py-3 font-semibold text-[#0e2238] transition hover:bg-[#c6f20b]"
            >
              Back to home
            </Link>
            <Link
              href="/our-system"
              className="type-body inline-flex items-center rounded-full border border-white/25 px-7 py-3 font-semibold text-white transition hover:border-[#d8ff35] hover:text-[#d8ff35]"
            >
              Our System
            </Link>
            <Link
              href="/inquiries"
              className="type-body inline-flex items-center rounded-full border border-white/25 px-7 py-3 font-semibold text-white transition hover:border-[#d8ff35] hover:text-[#d8ff35]"
            >
              Inquiries
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
