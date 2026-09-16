import type { Metadata } from "next";
import SiteShell from "@/components/site-shell";
import ChapterSplit from "@/components/chapter-split";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Inquiries | Sinag Global",
  description:
    "Talk to Sinag Global about power supply agreements, joint ventures, and EER-SPG deployment.",
};

/**
 * Every route here is real — tel: and mailto: work with no backend. There is
 * deliberately no submit form: the site has no API layer, and a form that
 * silently discards an inquiry is worse than none.
 */
const channels = [
  {
    label: "Email",
    lines: [{ text: "info@sinagglobal.com", href: "mailto:info@sinagglobal.com" }],
    note: "The fastest route for project briefs and documents.",
  },
  {
    label: "Phone",
    lines: [
      { text: "+63 917 881 0555", href: "tel:+639178810555" },
      { text: "+63 920 901 2450", href: "tel:+639209012450" },
    ],
    note: "Mon–Fri, 8am to 5pm.",
  },
  {
    label: "Office",
    lines: [
      { text: "5F Chemphil Bldg. 851 Arnaiz Ave.", href: null },
      { text: "Legaspi Village, Makati City 1223", href: null },
      { text: "Metro Manila", href: null },
    ],
    note: "Visits by appointment.",
  },
];

export default function InquiriesPage() {
  return (
    <SiteShell solidHeader>
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
        <ChapterSplit title="Inquiries">
          <ScrollReveal delayClassName="delay-1">
            <p className="type-body-lg font-semibold text-[var(--brand-dark)]">
              Whether you are exploring a power supply agreement, evaluating a joint venture, or scoping
              deployment for a specific facility, we would like to hear from you.
            </p>
          </ScrollReveal>
          <ScrollReveal className="mt-6" delayClassName="delay-2">
            <p className="type-body text-slate-700">
              It helps to tell us your load requirement, the site you have in mind, and your timeline. Send
              that through and we will route the inquiry to the right part of the team.
            </p>
          </ScrollReveal>
          <ScrollReveal className="mt-8" delayClassName="delay-2">
            <a
              href="mailto:info@sinagglobal.com"
              className="type-body inline-flex items-center gap-4 rounded-full bg-[var(--brand)] py-2 pl-7 pr-2 font-semibold text-white transition hover:bg-[var(--brand-dark)]"
            >
              Send us an inquiry
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--brand-dark)]">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 12h15m-6-6 6 6-6 6"
                  />
                </svg>
              </span>
            </a>
          </ScrollReveal>
        </ChapterSplit>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {channels.map((channel, index) => (
            <ScrollReveal
              key={channel.label}
              delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}
            >
              <article className="card-lift h-full rounded-2xl border border-[#cfe0ea] bg-white px-8 py-8 shadow-[0_14px_28px_rgba(12,47,87,0.06)] hover:border-[#0a745f]/40 hover:shadow-[0_24px_44px_rgba(12,47,87,0.14)]">
                <p className="type-kicker font-semibold uppercase tracking-[0.16em] text-[#0a745f]">
                  {channel.label}
                </p>
                <div className="type-body mt-4 space-y-1 text-[var(--brand-dark)]">
                  {channel.lines.map((line) =>
                    line.href ? (
                      <p key={line.text}>
                        <a
                          href={line.href}
                          className="font-semibold transition hover:text-[#0a745f]"
                        >
                          {line.text}
                        </a>
                      </p>
                    ) : (
                      <p key={line.text} className="font-semibold">
                        {line.text}
                      </p>
                    ),
                  )}
                </div>
                <p className="type-body-sm mt-4 text-slate-600">{channel.note}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
