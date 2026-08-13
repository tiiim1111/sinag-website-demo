import Image from "next/image";
import ChapterTabs from "@/components/chapter-tabs";
import ScrollReveal from "@/components/scroll-reveal";

const designedFor = [
  "Continuous baseload output",
  "Zero greenhouse gas and carbon emissions",
  "No fossil fuel or feedstock requirement",
  "No dependence on sunlight, wind, water flow, or site-specific resource conditions",
  "High capacity factor operation",
  "Embedded deployment at the consumer facility",
  "Distributed power generation for microgrids, distribution companies, and utilities",
  "Lower delivered cost of energy to consumers",
];

const whatItRemoves = [
  { designedFor: "Continuous baseload output", removes: "Intermittency risk" },
  { designedFor: "Zero GHG and carbon emissions", removes: "Combustion-related emissions" },
  { designedFor: "No fossil fuel / feedstock", removes: "Fuel logistics and commodity exposure" },
  { designedFor: "Site-flexible operation", removes: "Weather and site constraints" },
  {
    designedFor: "Embedded / distributed deployment",
    removes: "Exclusive dependence on long-distance delivery",
  },
  { designedFor: "Lower delivered cost of energy", removes: "Excess external charge exposure" },
];

const capabilities = [
  { title: "Continuous Output", body: "Designed for baseload power generation" },
  { title: "Clean Operation", body: "Net zero greenhouse gas and carbon emissions" },
  { title: "Fuel Independence", body: "No fossil fuel, biomass, or external feedstock supply" },
  {
    title: "Scalable Deployment",
    body: "Designed for facility-level, distributed, and larger power applications",
  },
  { title: "Site Flexibility", body: "No specific location or environmental condition required" },
  {
    title: "Stationary Electromagnetic Generation",
    body: "No traditional rotating generator mechanism",
  },
  {
    title: "Regenerative Operating Architecture",
    body: "Loop back excitation supports continuous operation after startup",
  },
];

const designChoices = [
  {
    choice: "No fuel or feedstock",
    value: "Lower exposure to commodity pricing and supply logistics",
  },
  { choice: "Close-to-load generation", value: "Reduced grid dependency and delivery losses" },
  { choice: "Continuous operation", value: "Clean power without sacrificing reliability" },
  { choice: "Baseload performance", value: "Practical relevance for critical operations" },
];

const embeddedOutcomes = [
  "Generate clean power closer to the load.",
  "Reduce dependency.",
  "Improve control.",
];

function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <ScrollReveal>
      <h2 className="type-title max-w-6xl font-semibold tracking-tight text-[var(--brand-dark)] md:type-display">
        {children}
      </h2>
    </ScrollReveal>
  );
}

function EerSpgPanel() {
  return (
    <>
      <PanelHeading>GEMCOR&apos;s Solution: EER-SPG</PanelHeading>

      <ScrollReveal className="mt-8" delayClassName="delay-1">
        <p className="type-body max-w-5xl text-slate-700">
          EER-SPG is GEMCOR&apos;s clean on-demand baseload power generation system, designed to generate
          continuous electricity through electromagnetic processes, without fossil fuels, feedstock, weather
          dependency, or conventional rotating generator mechanisms.
        </p>
      </ScrollReveal>
      <ScrollReveal className="mt-6" delayClassName="delay-1">
        <p className="type-body max-w-5xl text-slate-700">
          The system is modular, scalable, and suitable for embedded, distributed, and centralised power
          applications.
        </p>
      </ScrollReveal>

      <ScrollReveal className="mx-auto mt-10 max-w-3xl" delayClassName="delay-2">
        <div className="relative mx-auto aspect-[16/9] w-full">
          <Image
            src="/overview/eer.png"
            alt="EER-SPG container unit"
            fill
            sizes="(min-width: 1024px) 48rem, 100vw"
            className="object-contain"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-10" delayClassName="delay-2">
        <div className="mx-auto max-w-4xl text-center">
          <p className="type-body text-slate-700">Our goal is simple:</p>
          <p className="type-emphasis mt-3 font-semibold text-[#0a745f]">
            Deliver stable clean electricity where it is needed, when it is needed, and at the scale
            required by the user.
          </p>
        </div>
      </ScrollReveal>
    </>
  );
}

function CleanBaseloadPanel() {
  return (
    <>
      <PanelHeading>Clean Baseload, Without the Traditional Constraints</PanelHeading>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
        <ScrollReveal delayClassName="delay-1">
          <p className="type-body text-slate-700">
            EER-SPG <span className="font-semibold text-[var(--brand-dark)]">changes the operating logic
            of clean power generation</span>. It is designed for:
          </p>
          <ul className="type-body-sm mt-6 space-y-3 text-slate-700">
            {designedFor.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0a745f]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="type-body mt-8 text-slate-700">
            This is{" "}
            <span className="font-semibold text-[#0a745f]">clean energy designed around the load</span>, not
            around the weather.
          </p>
        </ScrollReveal>

        <ScrollReveal delayClassName="delay-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-left">
              <caption className="sr-only">
                What EER-SPG is designed for, and what each design choice removes
              </caption>
              <thead>
                <tr className="bg-[#dfe9ef]">
                  <th
                    scope="col"
                    className="type-kicker px-4 py-3 font-semibold uppercase tracking-[0.12em] text-[#0a745f]"
                  >
                    EER-SPG is designed for
                  </th>
                  <th
                    scope="col"
                    className="type-kicker px-4 py-3 font-semibold uppercase tracking-[0.12em] text-[#0a745f]"
                  >
                    What it removes
                  </th>
                </tr>
              </thead>
              <tbody>
                {whatItRemoves.map((row, index) => (
                  <tr key={row.designedFor} className={index % 2 === 0 ? "bg-white/70" : "bg-white/40"}>
                    <th
                      scope="row"
                      className="type-body-sm border-t border-[#cfe0ea] px-4 py-3 text-left font-semibold text-[var(--brand-dark)]"
                    >
                      {row.designedFor}
                    </th>
                    <td className="type-body-sm border-t border-[#cfe0ea] px-4 py-3 text-slate-700">
                      {row.removes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
}

function CapabilityCard({
  item,
  index,
}: {
  item: (typeof capabilities)[number];
  index: number;
}) {
  return (
    <ScrollReveal delayClassName={index === 0 ? "" : index === 1 ? "delay-1" : "delay-2"}>
      <article className="card-lift h-full rounded-2xl border border-[#cfe0ea] bg-white px-7 py-7 text-center shadow-[0_14px_28px_rgba(12,47,87,0.06)] hover:border-[#0a745f]/40 hover:shadow-[0_24px_44px_rgba(12,47,87,0.14)]">
        <h3 className="type-emphasis font-semibold tracking-tight text-[#0a745f]">{item.title}</h3>
        <p className="type-kicker mt-3 font-semibold uppercase tracking-[0.1em] text-slate-600">
          {item.body}
        </p>
      </article>
    </ScrollReveal>
  );
}

function CapabilitiesPanel() {
  return (
    <>
      <PanelHeading>Unique Capabilities of EER-SPG</PanelHeading>

      <ScrollReveal className="mt-8" delayClassName="delay-1">
        <p className="type-body-lg max-w-5xl text-slate-700">
          EER-SPG brings together the capabilities energy users have historically had to choose between.
        </p>
      </ScrollReveal>

      {/* 3 / 2 / 2 as in the deck — a plain 3-column grid would strand the seventh card alone. */}
      <div className="mt-10 space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
          {capabilities.slice(0, 3).map((item, index) => (
            <CapabilityCard key={item.title} item={item} index={index} />
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {capabilities.slice(3, 5).map((item, index) => (
            <CapabilityCard key={item.title} item={item} index={index} />
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {capabilities.slice(5).map((item, index) => (
            <CapabilityCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}

function AdvantagesPanel() {
  return (
    <>
      <PanelHeading>Economic &amp; Environmental Advantages</PanelHeading>

      <ScrollReveal className="mt-8" delayClassName="delay-1">
        <p className="type-body max-w-5xl text-slate-700">
          EER-SPG is built to improve the economics and environmental profile of power generation at the
          same time.
        </p>
      </ScrollReveal>
      <ScrollReveal className="mt-6" delayClassName="delay-1">
        <p className="type-body max-w-5xl text-slate-700">
          By removing fuel and feedstock from the generation model, the system reduces exposure to
          commodity pricing, import dependency, supply logistics, and combustion-related emissions.
        </p>
      </ScrollReveal>

      <ScrollReveal className="mt-10" delayClassName="delay-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] max-w-4xl border-collapse text-left">
            <caption className="sr-only">Design choices and the customer value each one delivers</caption>
            <thead>
              <tr className="bg-[#dfe9ef]">
                <th
                  scope="col"
                  className="type-kicker px-4 py-3 font-semibold uppercase tracking-[0.12em] text-[#0a745f]"
                >
                  Design choice
                </th>
                <th
                  scope="col"
                  className="type-kicker px-4 py-3 font-semibold uppercase tracking-[0.12em] text-[#0a745f]"
                >
                  Customer value
                </th>
              </tr>
            </thead>
            <tbody>
              {designChoices.map((row, index) => (
                <tr key={row.choice} className={index % 2 === 0 ? "bg-white/70" : "bg-white/40"}>
                  <th
                    scope="row"
                    className="type-body-sm whitespace-nowrap border-t border-[#cfe0ea] px-4 py-3 text-left font-semibold text-[var(--brand-dark)]"
                  >
                    {row.choice}
                  </th>
                  <td className="type-body-sm border-t border-[#cfe0ea] px-4 py-3 text-slate-700">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-10" delayClassName="delay-2">
        <p className="type-body max-w-5xl text-slate-700">
          By generating electricity close to the point of demand, EER-SPG can reduce dependence on
          long-distance transmission and distribution infrastructure. By operating continuously, it
          supports energy users that need clean power{" "}
          <span className="font-semibold text-[var(--brand-dark)]">without sacrificing reliability</span>.
          For customers, the value is not only cleaner electricity.{" "}
          <span className="font-semibold text-[#0a745f]">
            It&apos;s cleaner electricity with baseload performance.
          </span>
        </p>
      </ScrollReveal>
    </>
  );
}

function EmbeddedPowerPanel() {
  return (
    <>
      <PanelHeading>Embedded Clean Power</PanelHeading>

      <ScrollReveal className="mt-8" delayClassName="delay-1">
        <p className="type-body max-w-5xl text-slate-700">
          EER-SPG can be deployed directly where power is consumed. For embedded generation, this creates a
          more direct relationship between the power source and the energy user, reducing reliance on
          centralised generation and long-distance delivery.
        </p>
      </ScrollReveal>
      <ScrollReveal className="mt-6" delayClassName="delay-1">
        <p className="type-body max-w-5xl text-slate-700">
          The embedded model is designed to reduce or eliminate key external charges associated with
          conventional electricity delivery, including transmission, distribution, demand, system loss, and
          related pass-through charges, depending on the applicable regulatory and commercial structure.
        </p>
      </ScrollReveal>

      <ScrollReveal className="mt-12" delayClassName="delay-2">
        <p className="type-body-lg mx-auto max-w-6xl text-center font-semibold text-slate-600">
          {embeddedOutcomes.join(" ")}{" "}
          <span className="text-[#0a745f]">Strengthen resilience.</span>
        </p>
      </ScrollReveal>
    </>
  );
}

const chapters = [
  { id: "eer-spg", label: "EER-SPG", panel: <EerSpgPanel /> },
  { id: "clean-baseload", label: "Clean Baseload", panel: <CleanBaseloadPanel /> },
  { id: "capabilities", label: "Capabilities", panel: <CapabilitiesPanel /> },
  { id: "advantages", label: "Advantages", panel: <AdvantagesPanel /> },
  { id: "embedded-power", label: "Embedded Power", panel: <EmbeddedPowerPanel /> },
];

/** "GEMCOR's Solution: EER-SPG" — the five solution chapters, tabbed. Our System only. */
export default function SolutionSection() {
  return (
    <ChapterTabs
      id="solution"
      kicker="Solution"
      ariaLabel="The EER-SPG solution"
      chapters={chapters}
      overlapPrevious
    />
  );
}
