import ScrollReveal from "@/components/scroll-reveal";

const valueCards = [
  {
    title: "Rising electricity costs",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <ellipse cx="17" cy="14" rx="7" ry="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M10 14v8c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5v-8" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <ellipse cx="30" cy="24" rx="7" ry="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M23 24v8c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5v-8" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Grid dependency and instability",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M18.7 8v32M29.3 8v32M8 18.7h32M8 29.3h32" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Transmission and distribution losses",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <path d="M10 36V16M22 36V10M34 36V24" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M8 36h28" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M17 15l9-7 12 9" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Intermittent renewable output",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <path d="M16 15c4-6 12-7 17-2s5 13 0 17" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
        <path d="M13 23c-3 1-5 4-5 7 0 4 3 8 8 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
        <path d="M20 31c2.6-4.3 5.8-7.5 10-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
        <circle cx="18" cy="13" r="2.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Fuel and feedstock exposure",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <rect x="12" y="8" width="22" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M34 14h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M18 18h10M18 24h10M18 30h10" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Carbon emissions and environmental risk",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <rect x="10" y="10" width="18" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M30 16c4 0 6 3 8 3M30 22c4 0 6 3 8 3M30 28c4 0 6 3 8 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    title: "Limited access to dependable baseload",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[#0b7f8f]">
        <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M14 14l20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    ),
  },
];

const topRowCards = valueCards.slice(0, 4);
const bottomRowCards = valueCards.slice(4);

type ChallengeCardProps = {
  title: string;
  icon: React.ReactNode;
};

function ChallengeCard({ title, icon }: ChallengeCardProps) {
  return (
    <article className="card-lift mx-auto w-full max-w-[290px] border border-[#cfe0ea] bg-white text-[#103133] [clip-path:polygon(10%_0,100%_0,90%_100%,0_100%)] px-7 py-8 shadow-[0_16px_34px_rgba(12,47,87,0.08)] hover:border-[#0b7f8f]/40 hover:shadow-[0_26px_48px_rgba(12,47,87,0.16)]">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-5 text-center text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-[#1b3c3c]">
        {title}
      </p>
    </article>
  );
}

/** Rendered on both the homepage and Our System. Keep it identical on both —
 *  if the two ever need to diverge, take the difference as a prop. */
export default function EnergyChallengeSection() {
  return (
    <section id="challenge" className="relative scroll-mt-20 overflow-hidden bg-[#eef4f7]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(12,47,87,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(12,47,87,0.05) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 text-[var(--brand-dark)] md:px-8 md:py-20">
        <ScrollReveal>
          <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#00a8a8]">Challenge</p>
        </ScrollReveal>
        <ScrollReveal className="mt-4" delayClassName="delay-1">
          <h2 className="type-title max-w-6xl font-semibold tracking-tight text-[var(--brand-dark)] md:type-display">
            The Energy Challenge
          </h2>
        </ScrollReveal>
        <ScrollReveal className="mt-8" delayClassName="delay-1">
          <p className="type-body-lg max-w-4xl text-slate-700">
            The world does not only need more energy.
          </p>
        </ScrollReveal>
        <ScrollReveal className="mt-8" delayClassName="delay-2">
          <p className="type-body-lg max-w-6xl text-slate-700">
            It needs energy that is
            <span className="font-semibold text-[var(--brand-dark)]"> continuously available</span>,
            <span className="font-semibold text-[var(--brand-dark)]"> commercially viable</span>, and
            <span className="font-semibold text-[var(--brand-dark)]"> environmentally responsible</span>. Across industries and
            public-sector systems, energy users are facing the same pressure points:
          </p>
        </ScrollReveal>

        <div className="mt-10 space-y-5">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {topRowCards.map((item, index) => (
              <ScrollReveal key={item.title} delayClassName={index > 0 ? "delay-1" : ""}>
                <ChallengeCard title={item.title} icon={item.icon} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mx-auto grid max-w-[920px] justify-center gap-5 md:grid-cols-2 xl:grid-cols-3">
            {bottomRowCards.map((item, index) => (
              <ScrollReveal
                key={item.title}
                delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}
              >
                <ChallengeCard title={item.title} icon={item.icon} />
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal className="mt-10" delayClassName="delay-2">
          <p className="type-body mx-auto max-w-5xl text-center text-slate-700">
            For critical operations, power cannot be occasional. It must be available whenever the load requires it.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
