import Image from "next/image";
import ChapterSplit from "@/components/chapter-split";
import ScrollReveal from "@/components/scroll-reveal";

/** Jurisdictions in the order the deck lists them. Scans are all portrait, ~3:4. */
const certificates = [
  { jurisdiction: "United States", image: "/patents/united-states.png" },
  { jurisdiction: "Japan", image: "/patents/japan.png" },
  { jurisdiction: "ARIPO", image: "/patents/aripo.png" },
  { jurisdiction: "Taiwan", image: "/patents/taiwan.png" },
  { jurisdiction: "South Korea", image: "/patents/south-korea.png" },
  { jurisdiction: "Indonesia", image: "/patents/indonesia.png" },
  { jurisdiction: "India", image: "/patents/india.png" },
  { jurisdiction: "Hong Kong", image: "/patents/hong-kong.png" },
  { jurisdiction: "GCC", image: "/patents/gcc.png" },
];

export default function PatentPortfolioSection() {
  return (
    <section id="patents" className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-24">
      <ChapterSplit title="Global Patent Portfolio" dark>
        <ScrollReveal delayClassName="delay-1">
          <p className="type-kicker font-semibold uppercase tracking-[0.18em] text-[#d8ff35]">
            Validation
          </p>
        </ScrollReveal>
        <ScrollReveal className="mt-4" delayClassName="delay-2">
          <p className="type-body text-slate-300">
            EER-SPG is protected by a global patent portfolio. After review by a panel of scientists in
            electromagnetism, power electronics, and electrical engineering, patents for the technology were
            successfully issued in multiple jurisdictions.
          </p>
        </ScrollReveal>
      </ChapterSplit>

      {/* Nine entries over five columns lands 5 + 4, the way the deck splits them.
          Flex rather than grid: a grid leaves the short last row flush left, and
          the widths subtract the gaps so the columns still line up. */}
      <div className="mt-12 flex flex-wrap justify-center gap-5">
        {certificates.map((certificate, index) => (
          <ScrollReveal
            key={certificate.jurisdiction}
            className="w-full sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-5rem)/5)]"
            delayClassName={index % 3 === 0 ? "" : index % 3 === 1 ? "delay-1" : "delay-2"}
          >
            <figure className="card-lift h-full rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-sm hover:border-[#d8ff35]/50 hover:bg-white/[0.1]">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-white">
                <Image
                  src={certificate.image}
                  alt={`${certificate.jurisdiction} patent certificate`}
                  fill
                  sizes="(min-width: 1280px) 14vw, (min-width: 768px) 30vw, 45vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="type-kicker mt-4 text-center font-semibold uppercase tracking-[0.14em] text-[#d8ff35]">
                {certificate.jurisdiction}
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
