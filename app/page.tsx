import Button from "@/components/Button";
import Hero from "@/components/Hero";
import SignatureCard from "@/components/SignatureCard";
import { images } from "@/lib/data";
import ProblemSection from "@/components/ProblemSection";
import StatementBand from "@/components/StatementBand";
import SystemModel from "@/components/SystemModel";
import Pillars from "@/components/Pillars";
import ImpactStats from "@/components/ImpactStats";
import JourneySection from "@/components/JourneySection";
import AudienceCTA from "@/components/AudienceCTA";
import ProjectCards from "@/components/ProjectCards";

export default function HomePage() {
  return (
    <>
      <Hero
        kicker="Belonging • Opportunity • Support"
        title="Changing the landscape of youth mental health."
        primary={<Button href="/funders">Fund this work</Button>}
        secondary={<Button href="/how-it-works" variant="ghost">See the system</Button>}
        image={images.hero}
        imageAlt="A diverse group of young people together, representing belonging and community"
      >
        Young people are falling through fragmented systems. We are building the relational infrastructure that connects schools, community, church and specialist support — so every young person can access belonging, opportunity and help.
      </Hero>
      <ProblemSection />
      <StatementBand />
      <SystemModel />
      <Pillars />
      <ProjectCards />
      <ImpactStats />
      <JourneySection />
      <AudienceCTA />
    </>
  );
}