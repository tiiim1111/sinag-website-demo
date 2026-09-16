import ScrollReveal from "@/components/scroll-reveal";

type ChapterSplitProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  /** Swap the heading and rule for a dark ground. Inquiries is the only one. */
  dark?: boolean;
};

/**
 * Two-column chapter: heading centred in the left column, a rule down the
 * middle, copy running left-aligned down the right.
 *
 * The rule and the centred heading are lg-only. Below that the columns stack,
 * where a vertical rule has nothing to divide and a centred heading would sit
 * off-axis above left-aligned copy.
 */
export default function ChapterSplit({ title, children, dark = false }: ChapterSplitProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-0">
      <ScrollReveal className="lg:pr-14">
        <h2
          className={`type-title font-semibold tracking-tight lg:text-center ${
            dark ? "text-white" : "text-[var(--brand-dark)]"
          }`}
        >
          {title}
        </h2>
      </ScrollReveal>
      <div className={`lg:border-l lg:pl-14 ${dark ? "lg:border-white/15" : "lg:border-[#cfe0ea]"}`}>
        {children}
      </div>
    </div>
  );
}
