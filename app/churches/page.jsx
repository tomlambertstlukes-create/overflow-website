import { Church, HandHeart, Map, School } from "lucide-react";
import { images } from "@/lib/data";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import SignatureCard from "@/components/SignatureCard";
import FeatureGrid from "@/components/FeatureGrid";
import ProcessFlow from "@/components/ProcessFlow";

export default function ChurchesPage() {
  return (
    <>
      <Hero
        kicker="For churches"
        title="Reconnecting a generation with the Church."
        primary={<Button href="mailto:hello@example.com">Partner your church</Button>}
        secondary={<Button href="/how-it-works" variant="ghost">Explore the pathway</Button>}
        image={images.church}
        imageAlt="Young people gathered in a community space, representing belonging, faith and long-term connection"
      >
        Young people are not rejecting connection. They are looking for trusted relationships, meaningful belonging and communities where they can find identity, purpose and hope.
      </Hero>

      <FeatureGrid
      kicker="The opportunity"
        title="Local churches can become a spiritual solution at the heart of young people’s worlds."
        intro="The church becomes credible again by being present, useful, relational and consistent in the places young people already are."
        features={[
          { icon: School, title: "Presence in schools", text: "Support churches to build credible, trusted links with local schools." },
          { icon: HandHeart, title: "Community hubs", text: "Create safe spaces where young people can belong beyond school hours." },
          { icon: Church, title: "Faith pathways", text: "Gently connect young people into worshipping communities and discipleship." },
          { icon: Map, title: "Local mission", text: "Equip churches to respond to real needs in their own communities." },
        ]}
      />

      <ProcessFlow
        kicker="Church pathway"
        title="From relationship to belonging, faith and leadership."
        steps={[
          { title: "Presence", text: "Church becomes visible and trusted in young people’s ordinary worlds." },
          { title: "Relationship", text: "Long-term trust is built through consistent people and places." },
          { title: "Belonging", text: "Young people find community through projects, hubs and groups." },
          { title: "Faith", text: "Safe opportunities emerge to explore Jesus and spiritual life." },
          { title: "Leadership", text: "Young people grow into participation, service and mission." },
        ]}
      />
    </>
  );
}