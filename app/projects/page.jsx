import Button from "@/components/Button";
import { images } from "@/lib/data";
import Hero from "@/components/Hero";
import SignatureCard from "@/components/SignatureCard";
import ProjectCards from "@/components/ProjectCards";
import SystemModel from "@/components/SystemModel";

export default function ProjectsPage() {
  return (
    <>
      <Hero
        kicker="Projects"
        title="The connected projects that make the system work."
        primary={<Button href="/projects/wellbeing-centres">Start with Wellbeing Centres</Button>}
        secondary={<Button href="/how-it-works" variant="ghost">See the system</Button>}
        image={images.projects}
        imageAlt="Young people taking part in community activities, representing connected projects"
      >
        These are not isolated activities. Each project is a doorway into belonging, early support, targeted intervention and long-term relational care.
      </Hero>
      <ProjectCards showHeader={false} />
      <SystemModel />
    </>
  );
}