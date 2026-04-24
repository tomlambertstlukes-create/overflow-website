import { MessageCircle, Network, Sparkles, Users } from "lucide-react";
import { images } from "@/lib/data";
import Hero from "@/components/Hero";
import Button from "@/components/Button";
import SignatureCard from "@/components/SignatureCard";
import SystemModel from "@/components/SystemModel";
import ProcessFlow from "@/components/ProcessFlow";
import FeatureGrid from "@/components/FeatureGrid";

export default function HowItWorksPage() {
  return (
    <>
      <Hero
        kicker="How it works"
        title="A connected system built around the young person."
        primary={<Button href="/schools">Partner with us</Button>}
        secondary={<Button href="/projects" variant="ghost">View projects</Button>}
        image={images.mentoring}
        imageAlt="A trusted adult listening to a young person, representing relationship-based support"
      >
        Our model is not a linear programme. It is an interconnected pathway that keeps young people connected before, during and beyond intervention.
      </Hero>

      <ProcessFlow
        kicker="The pathway"
        title="Presence, relationship, support, belonging and transformation."
        intro="The aim is not to move a young person through a service and out again. The aim is to build long-term connection around them."
        steps={[
             { title: "Presence", text: "We are consistently present in schools and community spaces." },
          { title: "Relationship", text: "Trust is built through repeated contact and known adults." },
          { title: "Support", text: "Young people access listening, mentoring and targeted interventions." },
          { title: "Belonging", text: "Support connects into clubs, drop-ins, sport, dance, arts and community." },
          { title: "Transformation", text: "Young people grow in confidence, resilience, purpose and hope." },
        ]}
      />

      <SystemModel />

      <FeatureGrid
        kicker="Why it works"
        title="The overlap is the strategy."
        features={[
          { icon: Network, title: "School + community", text: "Support does not stop at the school gate." },
          { icon: Users, title: "Participation + support", text: "Young people engage through things they enjoy and trust." },
          { icon: MessageCircle, title: "Intervention + relationship", text: "Help is more effective when it is delivered by trusted people." },
          { icon: Sparkles, title: "Belonging + purpose", text: "Long-term transformation grows from connection, agency and hope." },
        ]}
      />
    </>
  );
}