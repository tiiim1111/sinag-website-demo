import SiteShell from "@/components/site-shell";
import EnergyChallengeSection from "@/components/energy-challenge-section";
import ScrollStack from "@/components/scroll-stack";
import SolutionSection from "@/components/solution-section";
import TechnologySection from "@/components/technology-section";

export default function OurSystemPage() {
  return (
    <SiteShell>
      {/*
        Each section holds still once its bottom meets the bottom of the
        viewport while the next one rides up over it. Nesting chains the
        handoffs: Challenge → Solution → Technology. Every pinned section needs
        trailingSpace, or it pins after only its overflow past the viewport and
        gets covered before it can be read.
      */}
      <ScrollStack pinned={<EnergyChallengeSection asPageOpener tabbed trailingSpace />}>
        <ScrollStack pinned={<SolutionSection trailingSpace />}>
          <TechnologySection />
        </ScrollStack>
      </ScrollStack>
    </SiteShell>
  );
}
