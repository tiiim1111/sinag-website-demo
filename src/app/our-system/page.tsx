import SiteShell from "@/components/site-shell";
import EnergyChallengeSection from "@/components/energy-challenge-section";

export default function OurSystemPage() {
  return (
    <SiteShell solidHeader>
      <EnergyChallengeSection asPageOpener tabbed />
    </SiteShell>
  );
}
