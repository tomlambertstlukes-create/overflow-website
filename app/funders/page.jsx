import { BarChart3, HeartHandshake, Network, Users } from "lucide-react";
import { images, contact } from "@/lib/data";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import CostBlock from "@/components/CostBlock";
import SystemModel from "@/components/SystemModel";
import ProjectCards from "@/components/ProjectCards";

export const metadata = {
  title: "For Funders",
  description:
    "Invest in the relational infrastructure connecting schools, families, community projects, volunteers and specialist partners around young people in Havering.",
};

export default function FundersPage() {
  return (
    <>
      <Hero
        kicker="For funders and donors"
        title="Invest in infrastructure-level change"
        titleAccent=" around young people."
        primary={<Button href={`mailto:${contact.email}`}>Discuss funding</Button>}
        secondary={
          <Button href="/impact" variant="ghost">
            Our approach to impact
          </Button>
        }
        image={images.funders}
        imageAlt="Young people together in a supportive community"
      >
        Kingdom Overflow is now delivering a joined-up wellbeing partnership in
        Havering. Funding strengthens the relational infrastructure connecting
        schools, families, community projects, volunteers and specialist
        partners—so capacity can grow around need.
      </Hero>

      <FeatureGrid
        kicker="Why this matters"
        title="The need is urgent, but the opportunity is strategic."
        intro="Young people do not experience life in separate services. Investing in coordination, relationships and community pathways helps existing support work together more effectively."
        features={[
          {
            icon: Users,
            title: "Earlier engagement",
            text: "A known, school-embedded presence makes support easier to reach before problems escalate.",
          },
          {
            icon: Network,
            title: "Joined-up provision",
            text: "Schools, families, volunteers, activities and specialist partners become part of one connected pathway.",
          },
          {
            icon: HeartHandshake,
            title: "Belonging beyond intervention",
            text: "Dance, Create, Football and the Overflow Hub provide ongoing relationships and positive community.",
          },
          {
            icon: BarChart3,
            title: "Learning and evidence",
            text: "Delivery is monitored through reach, participation, feedback, progress and partnership capacity.",
          },
        ]}
      />

      <CostBlock />
      <SystemModel />
      <ProjectCards />
    </>
  );
}
