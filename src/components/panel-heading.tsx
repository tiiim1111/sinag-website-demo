import ScrollReveal from "@/components/scroll-reveal";

/** Chapter panel heading. Stays left-aligned while the copy under it is centred. */
export default function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <ScrollReveal>
      <h2 className="type-title max-w-6xl font-semibold tracking-tight text-[var(--brand-dark)] md:type-display">
        {children}
      </h2>
    </ScrollReveal>
  );
}
