import { MessageCircle, Network, Sparkles, Users } from "lucide-react";
import { images } from "@/lib/data";
import Hero from "@/components/Hero";
import Button from "@/components/Button";
import SystemModel from "@/components/SystemModel";
import ProcessFlow from "@/components/ProcessFlow";
import FeatureGrid from "@/components/FeatureGrid";
import JourneySection from "@/components/JourneySection";

export const metadata = {
  title: "How It Works",
  description:
    "Kingdom Overflow builds personalised networks of relationships, opportunities and support around young people across school and community life.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Hero
        kicker="How it works"
        title="Support built around the young person"
        titleAccent="—not a fixed programme."
        primary={<Button href="/schools">Partner with us</Button>}
        secondary={
          <Button href="/projects" variant="ghost">
            View projects
          </Button>
        }
        image={images.mentoring}
        imageAlt="A trusted adult listening to a young person"
      >
        Every young person is different. Kingdom Overflow brings together
        trusted relationships, school support, community opportunities, families
        and specialist partners to create a response around their needs,
        strengths and aspirations.
      </Hero>

      <ProcessFlow
        kicker="Connecting support"
        title="From relational presence to the right support."
        intro="The aim is not to move a young person through a service and out again. It is to understand the person, build the right network around them and maintain connection beyond a particular intervention."
        steps={[
          {
            title: "Relational presence",
            text: "Trusted adults become familiar, approachable and consistently available.",
          },
          {
            title: "Understand need",
            text: "We listen to the young person and those around them, recognising needs, strengths and aspirations.",
          },
          {
            title: "Personalised response",
            text: "The right mix of relationship, activity, mentoring, group work or other support is shaped around the person.",
          },
          {
            title: "Connected network",
            text: "School, family, community opportunities, volunteers and partners contribute rather than work in isolation.",
          },
          {
            title: "Targeted support",
            text: "Where required, trusted pathways lead into appropriately qualified specialist or clinical provision.",
          },
        ]}
      />

      <SystemModel />

      <JourneySection />

      <FeatureGrid
        kicker="Why relationships matter"
        title="Support is only accessible when young people can reach, trust and use it."
        features={[
          {
            icon: Users,
            title: "Belonging first",
            text: "Connection, participation and positive relationships can become the doorway into wellbeing support.",
          },
          {
            icon: MessageCircle,
            title: "Rapport-led",
            text: "Young people are more likely to engage with support from people they know, recognise and feel comfortable with.",
          },
          {
            icon: Network,
            title: "Beyond the school gate",
            text: "School-based support connects with community relationships and opportunities that can continue beyond the school day.",
          },
          {
            icon: Sparkles,
            title: "Responsive, not fixed",
            text: "Options, partnerships and pathways allow the response to change with the young person and local need.",
          },
        ]}
      />
    </>
  );
}
