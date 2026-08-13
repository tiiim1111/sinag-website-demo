import SiteShell from "@/components/site-shell";
import EnergyChallengeSection from "@/components/energy-challenge-section";
import SolutionSection from "@/components/solution-section";

export default function OurSystemPage() {
  return (
    <SiteShell>
      <EnergyChallengeSection asPageOpener tabbed />
      <SolutionSection />
    </SiteShell>
  );
}
