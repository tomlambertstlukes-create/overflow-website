import { Coffee, HeartHandshake, Home, Users } from "lucide-react";
import ProjectPage from "@/components/ProjectPage";
import { images } from "@/lib/data";

const project = {
  kicker: "Drop-ins & Community Hubs",
  title: "Safe spaces beyond school where young people can belong and be known.",
  hero:
    "Drop-ins and community hubs are the places where the system becomes relational: young people can turn up, feel welcome, be known and stay connected to support beyond school hours.",
  image: images.dropins,
  imageAlt:
    "Young people gathered in a relaxed community hub, representing safe space and belonging",
  whyTitle: "Support should not stop at the school gate.",
  whyIntro:
    "Many young people need somewhere to go, something positive to do and someone safe to talk to. Community hubs create the continuity that short-term interventions often cannot provide.",
  features: [
    {
      icon: Coffee,
      title: "Hospitality",
      text: "Welcoming spaces where young people feel safe and wanted.",
    },
    {
      icon: Home,
      title: "Belonging",
      text: "Consistent places that reduce isolation and build community.",
    },
    {
      icon: HeartHandshake,
      title: "Relational care",
      text: "Known adults available for conversation, support and encouragement.",
    },
    {
      icon: Users,
      title: "Pathways",
      text: "Links into sport, dance, art, mentoring, faith and specialist support.",
    },
  ],
  flowTitle: "From turning up to long-term connection.",
  flowIntro:
    "Drop-ins keep young people connected beyond school, beyond crisis and beyond single interventions.",
  steps: [
    {
      title: "Welcome",
      text: "Young people enter a safe, informal and hospitable space.",
    },
    {
      title: "Belong",
      text: "They form friendships and positive community.",
    },
    {
      title: "Be known",
      text: "Consistent adults build trust and notice needs.",
    },
    {
      title: "Access",
      text: "Support becomes available through relationship rather than referral alone.",
    },
    {
      title: "Stay connected",
      text: "Young people remain linked into long-term community and support.",
    },
  ],
};

export default function DropInsPage() {
  return <ProjectPage project={project} />;
}