import { MessageCircle, Network, Sparkles, Users } from "lucide-react";
import { images } from "@/lib/data";
import Hero from "@/components/Hero";
import Button from "@/components/Button";
import SystemModel from "@/components/SystemModel";
import ProcessFlow from "@/components/ProcessFlow";
import FeatureGrid from "@/components/FeatureGrid";

export const metadata = {
  title: "How It Works",
  description:
    "A connected pathway that keeps young people supported before, during and beyond intervention.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Hero
        kicker="How it works"
        title="A connected system built around the young person."
        primary={<Button href="/schools">Partner with us</Button>}
        secondary={
          <Button href="/projects" variant="ghost">
            View projects
          </Button>
        }
        image={images.mentoring}
        imageAlt="A trusted adult listening to a young person"
      >
        Our model is not a linear programme. A school-embedded coordinator
        connects school, family, community opportunities, volunteers and
        specialist partners so young people remain connected before, during and
        beyond intervention.
      </Hero>

      <ProcessFlow
        kicker="The pathway"
        title="Presence, relationship, support, belonging and growth."
        intro="The aim is not to move a young person through a service and out again. It is to build lasting connection and the right support around them."
        steps={[
          {
            title: "Presence",
            text: "Trusted adults are consistently present in school and community life.",
          },
          {
            title: "Relationship",
            text: "Trust grows through repeated contact, listening and reliability.",
          },
          {
            title: "Support",
            text: "Young people access appropriate mentoring, groups, learning and specialist pathways.",
          },
          {
            title: "Belonging",
            text: "Support connects into Hub, Dance, Create, Football and wider community.",
          },
          {
            title: "Growth",
            text: "Confidence, resilience, agency, relationships and hope can develop over time.",
          },
        ]}
      />

      <SystemModel />

      <FeatureGrid
        kicker="Why it works"
        title="The overlap is the strategy."
        features={[
          {
            icon: Network,
            title: "School + community",
            text: "Support does not stop at the school gate.",
          },
          {
            icon: Users,
            title: "Participation + support",
            text: "Young people engage through familiar people, places and activities.",
          },
          {
            icon: MessageCircle,
            title: "Intervention + relationship",
            text: "Specialist input remains connected to trusted relationships around the young person.",
          },
          {
            icon: Sparkles,
            title: "Belonging + opportunity",
            text: "Long-term change grows through connection, agency and positive routes forward.",
          },
        ]}
      />
    </>
  );
}
