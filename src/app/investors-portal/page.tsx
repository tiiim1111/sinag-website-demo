import SiteShell from "@/components/site-shell";

export default function InvestorsPortalPage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-32">
        <p className="type-kicker font-semibold tracking-[0.16em] text-[var(--accent)]">INVESTORS PORTAL</p>
        <h1 className="type-title mt-4 font-semibold text-[var(--brand-dark)]">Investors Portal</h1>
        <p className="type-body mt-4 max-w-3xl text-slate-600">
          This page is currently framed as a secure access point for prospective investors, strategic partners, and
          stakeholders who need controlled access to company materials.
        </p>
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--line)] bg-white p-10">
          <p className="type-body font-semibold text-[var(--brand-dark)]">This content is password protected.</p>
          <p className="type-body-sm mt-3 text-slate-600">
            To view this protected post, enter the password below. This text is copied from the current site and can
            be replaced later with your investor login flow.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="password"
              placeholder="Enter password"
              className="type-body-sm h-11 flex-1 rounded-lg border border-[var(--line)] px-4 focus:border-[var(--accent)] focus:outline-none"
            />
            <button
              type="button"
              className="type-body-sm h-11 rounded-lg bg-[var(--brand)] px-6 font-semibold text-white transition hover:bg-[var(--brand-dark)]"
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 pb-20">
        <div className="thin-border rounded-2xl bg-white p-8">
          <p className="type-kicker font-semibold tracking-[0.16em] text-[var(--accent)]">FUTURE CONTENT</p>
          <h2 className="type-emphasis mt-3 font-semibold text-[var(--brand-dark)]">What this portal can hold next</h2>
          <p className="type-body mt-4 text-slate-600">
            This section can later be extended to include investor decks, project overviews, leadership materials,
            partnership frameworks, milestone updates, and due diligence documents once you are ready to publish them.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
