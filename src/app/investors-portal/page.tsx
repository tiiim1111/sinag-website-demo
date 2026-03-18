import SiteShell from "@/components/site-shell";

export default function InvestorsPortalPage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-4xl px-6 py-20">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)]">INVESTORS PORTAL</p>
        <h1 className="mt-4 text-4xl font-semibold text-[var(--brand-dark)] md:text-5xl">Investors Portal</h1>
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--line)] bg-white p-10">
          <p className="text-lg font-semibold text-[var(--brand-dark)]">This content is password protected.</p>
          <p className="mt-3 text-slate-600">
            To view this protected post, enter the password below. This text is copied from the current site and can
            be replaced later with your investor login flow.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="password"
              placeholder="Enter password"
              className="h-11 flex-1 rounded-lg border border-[var(--line)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
            <button
              type="button"
              className="h-11 rounded-lg bg-[var(--brand)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
