import SiteShell from "@/components/site-shell";
import EnergyChallengeSection from "@/components/energy-challenge-section";
import ScrollStack from "@/components/scroll-stack";
import SolutionSection from "@/components/solution-section";

export default function OurSystemPage() {
  return (
    <SiteShell>
      <ScrollStack pinned={<EnergyChallengeSection asPageOpener tabbed />}>
        <SolutionSection />
      </ScrollStack>
    </SiteShell>
  );
}
