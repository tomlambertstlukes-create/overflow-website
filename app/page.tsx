import Button from "@/components/Button";
import Hero from "@/components/Hero";
import { images } from "@/lib/data";
import DeliveryNow from "@/components/DeliveryNow";
import ProblemSection from "@/components/ProblemSection";
import StatementBand from "@/components/StatementBand";
import SystemModel from "@/components/SystemModel";
import Pillars from "@/components/Pillars";
import JourneySection from "@/components/JourneySection";
import AudienceCTA from "@/components/AudienceCTA";
import ProjectCards from "@/components/ProjectCards";

export const metadata = {
  title: "Kingdom Overflow | Young people, wellbeing and community",
  description:
    "Kingdom Overflow is building the relational infrastructure that connects schools, families, community projects, volunteers and specialist partners around young people in Havering.",
};

export default function HomePage() {
  return (
    <>
      <Hero
        kicker="Belonging • Opportunity • Support"
        title="Transforming the landscape of youth and young adult mental health—and rebuilding youth community."
        primary={<Button href="/schools">Partner with us</Button>}
        secondary={
          <Button href="/how-it-works" variant="ghost">
            See the system
          </Button>
        }
        image={images.hero}
        imageAlt="Young people together, representing belonging and community"
      >
        Kingdom Overflow is building the relational infrastructure that connects
        schools, families, community projects, volunteers and specialist partners
        around young people. In Havering, this is taking shape through a joined-up
        school and community wellbeing partnership led by a school-embedded
        Relational Support Coordinator.
      </Hero>
      <DeliveryNow />
      <ProblemSection />
      <StatementBand />
      <SystemModel />
      <Pillars />
      <ProjectCards />
      <JourneySection />
      <AudienceCTA />
    </>
  );
}
