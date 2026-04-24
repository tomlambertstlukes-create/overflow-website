import Button from "@/components/Button";
import Hero from "@/components/Hero";
import SignatureCard from "@/components/SignatureCard";
import FeatureGrid from "@/components/FeatureGrid";
import ProcessFlow from "@/components/ProcessFlow";
import ProjectCards from "@/components/ProjectCards";

export default function ProjectPage({ project }) {
  return (
    <>
      <Hero
        kicker={project.kicker}
        title={project.title}
        primary={<Button href="mailto:hello@example.com">Talk to us</Button>}
        secondary={<Button href="/projects" variant="ghost">All projects</Button>}
        image={project.image}
        imageAlt={project.imageAlt}
      >
        {project.hero}
      </Hero>

      <FeatureGrid
        kicker="Why it matters"
        title={project.whyTitle}
        intro={project.whyIntro}
        features={project.features}
      />
      <ProcessFlow
        kicker="How it connects"
        title={project.flowTitle}
        intro={project.flowIntro}
        steps={project.steps}
      />

      <ProjectCards />
    </>
  );
}
