import {
  BookOpenCheck,
  MessageCircle,
  Network,
  Presentation,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { images, contact } from "@/lib/data";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import ProcessFlow from "@/components/ProcessFlow";
import ProjectCards from "@/components/ProjectCards";

export const metadata = {
  title: "For Schools",
  description:
    "A school and community wellbeing partnership led by a school-embedded Relational Support Coordinator and connected to community and specialist pathways.",
};

export default function SchoolsPage() {
  return (
    <>
      <Hero
        kicker="For schools"
        title="A connected wellbeing partnership"
        titleAccent=" built for real school life."
        primary={<Button href={`mailto:${contact.email}`}>Book a conversation</Button>}
        secondary={
          <Button href="/projects/wellbeing-centres" variant="ghost">
            Explore the model
          </Button>
        }
        image={images.school}
        imageAlt="A mentoring conversation in a school setting, representing school-embedded relational support"
      >
        A school-embedded School & Community Relational Support Coordinator
        (RSC) works alongside pastoral teams, families, community projects,
        volunteers and specialist partners—expanding the support available
        around young people without asking schools to carry it alone.
      </Hero>

      <FeatureGrid
        kicker="What schools need"
        title="Support that reduces pressure instead of adding to it."
        intro="The partnership is developed with each school. The RSC becomes a known presence, responds to emerging needs and coordinates support across school and community life."
        features={[
          {
            icon: ShieldCheck,
            title: "School-embedded presence",
            text: "A trusted, consistent professional working within the rhythm of school and alongside the nominated school link.",
          },
          {
            icon: MessageCircle,
            title: "Accessible support",
            text: "Listening, mentoring and low-barrier opportunities that help young people engage earlier.",
          },
          {
            icon: Target,
            title: "Responsive interventions",
            text: "Individual and group work developed around the needs identified by the school and young people.",
          },
          {
            icon: Network,
            title: "Pathway coordination",
            text: "Supported connections into community activities, volunteers, families and appropriate specialist partners.",
          },
        ]}
      />

      <ProcessFlow
        kicker="The coordinating role"
        title="From visible presence to connected support."
        intro="The RSC is not expected to do all the work. The role grows capacity, develops partnerships and helps the right people contribute around each young person."
        steps={[
          {
            title: "Embed",
            text: "The RSC becomes part of school life and works collegiately with pastoral staff.",
          },
          {
            title: "Build trust",
            text: "Young people engage because support is familiar, consistent and accessible.",
          },
          {
            title: "Identify",
            text: "Needs and strengths are understood through relationships and staff collaboration.",
          },
          {
            title: "Coordinate",
            text: "The RSC brings together the appropriate support, activity, volunteer or partner.",
          },
          {
            title: "Stay connected",
            text: "Relationships continue before, during and beyond a particular intervention.",
          },
        ]}
      />

      <FeatureGrid
        kicker="A responsive offer"
        title="Provision can flex around the school’s priorities."
        intro="Delivery is non-clinical. Where counselling or clinical support is appropriate, Kingdom Overflow develops supported pathways through qualified partners."
        features={[
          {
            icon: Users,
            title: "Individual and group support",
            text: "Relational one-to-one work, mentoring and groups responding to an identified need.",
          },
          {
            icon: Presentation,
            title: "Assemblies and PSHE",
            text: "Curriculum-linked learning that builds practical mental health and wellbeing techniques.",
          },
          {
            icon: BookOpenCheck,
            title: "Universal participation",
            text: "Dance, Create, Football and Hub activities that develop belonging, confidence and positive relationships.",
          },
          {
            icon: Network,
            title: "Specialist pathways",
            text: "Supported signposting and partnership provision where a young person needs additional expertise.",
          },
        ]}
      />

      <ProjectCards />
    </>
  );
}
