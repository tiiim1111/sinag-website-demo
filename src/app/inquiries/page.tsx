import type { Metadata } from "next";
import SiteShell from "@/components/site-shell";
import ChapterSplit from "@/components/chapter-split";
import InquiryForm from "@/components/inquiry-form";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Inquiries | Sinag Global",
  description:
    "Talk to Sinag Global about power supply agreements, joint ventures, and EER-SPG deployment.",
};

/**
 * Contact routes shown beside the form. tel: and mailto: work with no backend;
 * the form posts to /api/inquiries.
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
  // Dark ground, so the transparent header reads without solidHeader.
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
          className="pointer-events-none absolute -left-20 top-16 h-80 w-80 rounded-full bg-[#d8ff35]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-64 h-96 w-96 rounded-full bg-cyan-400/8 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
          <ChapterSplit title="Inquiries" dark>
            <ScrollReveal delayClassName="delay-1">
              <p className="type-body-lg font-semibold text-white">
                Whether you are exploring a power supply agreement, evaluating a joint venture, or
                scoping deployment for a specific facility, we would like to hear from you.
              </p>
            </ScrollReveal>
            <ScrollReveal className="mt-6" delayClassName="delay-2">
              <p className="type-body text-slate-300">
                It helps to tell us your load requirement, the site you have in mind, and your timeline.
                Send that through and we will route the inquiry to the right part of the team.
              </p>
            </ScrollReveal>
          </ChapterSplit>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16">
          <InquiryForm />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid gap-5 md:grid-cols-3">
            {channels.map((channel, index) => (
              <ScrollReveal
                key={channel.label}
                delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}
              >
                <article className="card-lift h-full rounded-[1.75rem] border border-white/15 bg-white/[0.06] px-8 py-8 backdrop-blur-sm hover:border-[#d8ff35]/50 hover:bg-white/[0.1]">
                  <p className="type-kicker font-semibold uppercase tracking-[0.16em] text-[#d8ff35]">
                    {channel.label}
                  </p>
                  <div className="type-body mt-4 space-y-1 text-white">
                    {channel.lines.map((line) =>
                      line.href ? (
                        <p key={line.text}>
                          <a
                            href={line.href}
                            className="font-semibold transition hover:text-[#d8ff35]"
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
                  <p className="type-body-sm mt-4 text-slate-400">{channel.note}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
