import { MessageCircle, Network, ShieldCheck, Target } from "lucide-react";
import { images } from "@/lib/data";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import SignatureCard from "@/components/SignatureCard";
import FeatureGrid from "@/components/FeatureGrid";
import ProcessFlow from "@/components/ProcessFlow";
import ProjectCards from "@/components/ProjectCards";

export default function SchoolsPage() {
  return (
    <>
      <Hero
        kicker="For schools"
        title="A connected wellbeing system for real school life."
        primary={<Button href="mailto:hello@example.com">Book a conversation</Button>}
        secondary={<Button href="/projects/wellbeing-centres" variant="ghost">Wellbeing Centres</Button>}
        image={images.school}
        imageAlt="A mentoring conversation in a school setting, representing embedded relational support"
      >
        Schools are carrying more than they were designed to carry. We place trusted relational support into the rhythm of school life and connect it to community projects, specialist pathways and long-term belonging.
      </Hero>

      <FeatureGrid
        kicker="What schools need"
        title="Support that reduces pressure instead of adding to it."
        intro="Our model is built with schools, not dropped onto them. It responds to real-time needs, pastoral pressures and the young people who are most likely to fall through the gaps."
        features={[
          { icon: ShieldCheck, title: "Embedded presence", text: "Trusted adults who become known faces within the school community." },
          { icon: MessageCircle, title: "Drop-in spaces", text: "Low-barrier places for young people to talk before issues escalate." },
          { icon: Target, title: "Targeted support", text: "Bespoke interventions designed around the needs of each setting." },
          { icon: Network, title: "Pathway coordination", text: "Helping young people access the right support at the right time." },
        ]}
      />

      <ProcessFlow
        title="From visible presence to measurable outcomes."
        intro="The worker is not just a delivery role. They are a connector across the whole school and community support ecosystem."
        steps={[
          { title: "Embed", text: "Relational Support Workers become part of the school rhythm." },
          { title: "Build trust", text: "Young people engage because support feels familiar and safe." },
          { title: "Identify", text: "Needs are spotted earlier through relationships and staff collaboration." },
          { title: "Support", text: "Mentoring, listening spaces and targeted interventions are delivered." },
          { title: "Connect", text: "Young people are linked into community projects and specialist pathways." },
        ]}
      />

      <ProjectCards />
    </>
  );
}