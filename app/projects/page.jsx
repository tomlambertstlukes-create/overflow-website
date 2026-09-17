import Button from "@/components/Button";
import { images } from "@/lib/data";
import Hero from "@/components/Hero";
import ProjectCards from "@/components/ProjectCards";
import SystemModel from "@/components/SystemModel";

export const metadata = {
  title: "Projects | Kingdom Overflow",
  description:
    "Explore the Overflow Wellbeing Centre, Overflow Hub, Overflow Dance, Overflow Create and Overflow Football.",
};

export default function ProjectsPage() {
  return (
    <>
      <Hero
        kicker="Connected delivery"
        title="Practical pathways into belonging, confidence and support."
        primary={
          <Button href="/projects/wellbeing-centres">
            Explore the Wellbeing Centre
          </Button>
        }
        secondary={
          <Button href="/how-it-works" variant="ghost">
            See the whole system
          </Button>
        }
        image={images.projects}
        imageAlt="Young people together, representing connected community projects"
      >
        Overflow Dance, Create, Football and the Overflow Hub are not isolated
        activities. They connect with the school-embedded RSC and wider partners
        to create familiar routes into positive community and ongoing
        relationships.
      </Hero>
      <ProjectCards showHeader={false} />
      <SystemModel />
    </>
  );
}
