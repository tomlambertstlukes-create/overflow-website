import { BarChart3, HeartHandshake, Network, Users } from "lucide-react";
import { images } from "@/lib/data";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import SignatureCard from "@/components/SignatureCard";
import FeatureGrid from "@/components/FeatureGrid";
import CostBlock from "@/components/CostBlock";
import SystemModel from "@/components/SystemModel";
import ImpactStats from "@/components/ImpactStats";
import ProjectCards from "@/components/ProjectCards";

export default function FundersPage() {
  return (
    <>
      <Hero
        kicker="For funders and donors"
        title="Invest in infrastructure-level change."
        primary={<Button href="mailto:hello@example.com">Fund a role</Button>}
        secondary={<Button href="/impact" variant="ghost">View impact</Button>}
        image={images.funders}
        imageAlt="Young people together in a supportive community, representing measurable relational impact"
      >
        This is not a short-term activity fund. Your support builds the relational infrastructure that connects schools, community, church and specialist support — changing outcomes at system level.
      </Hero>

      <FeatureGrid
      kicker="Why this matters"
        title="The need is urgent, but the opportunity is strategic."
        intro="Fragmented provision leaves young people waiting, excluded or unsupported. Funding relational infrastructure creates a connected pathway around them."
        features={[
          { icon: Users, title: "Rising need", text: "More young people are struggling with anxiety, isolation and self-worth." },
          { icon: Network, title: "Fragmented systems", text: "Support often exists in disconnected parts, leaving young people in the gaps." },
          { icon: HeartHandshake, title: "Relational solution", text: "Trusted presence creates engagement, early support and long-term care." },
          { icon: BarChart3, title: "Measurable impact", text: "Outcomes are tracked through attendance, surveys, feedback and progress data." },
        ]}
      />

      <CostBlock />
      <SystemModel />
      <ProjectCards />
      <ImpactStats />
    </>
  );
}
