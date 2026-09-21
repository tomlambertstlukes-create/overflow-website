import Button from "@/components/Button";
import Hero from "@/components/Hero";
import { images } from "@/lib/data";
import DeliveryNow from "@/components/DeliveryNow";
import ProblemSection from "@/components/ProblemSection";
import StatementBand from "@/components/StatementBand";
import Pillars from "@/components/Pillars";
import AudienceCTA from "@/components/AudienceCTA";

export const metadata = {
  title: "Young people, wellbeing and community",
  description:
    "Kingdom Overflow is building the relational infrastructure that connects schools, families, community projects, volunteers and specialist partners around young people in Havering.",
};

export default function HomePage() {
  return (
    <>
      <Hero
        kicker="Belonging • Opportunity • Wellbeing"
        title="Transforming youth mental health and"
        titleAccent=" rebuilding youth community."
        titleClassName="max-w-5xl text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl"
        primary={<Button href="/schools">Partner with us</Button>}
        secondary={
          <Button href="/how-it-works" variant="ghost">
            See the system
          </Button>
        }
        image={images.hero}
        imageAlt="Young people together, representing belonging and community"
      >
        Kingdom Overflow builds relational infrastructure around young people—
        connecting schools, communities, positive activities and specialist
        support so young people can belong, access support earlier and thrive.
      </Hero>
      <DeliveryNow />
      <ProblemSection />
      <StatementBand />
      <Pillars />
      <AudienceCTA />
    </>
  );
}
