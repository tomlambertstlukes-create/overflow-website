import {
  Coffee,
  HeartHandshake,
  Home,
  Network,
} from "lucide-react";
import ProjectPage from "@/components/ProjectPage";
import { images } from "@/lib/data";

export const metadata = {
  title: "Overflow Hub",
  description:
    "A welcoming community base for activities, support groups and interventions where young people can belong and stay connected.",
};

const project = {
  kicker: "Overflow Hub",
  title: "A welcoming community base where young people can belong and be known.",
  hero:
    "The Overflow Hub brings activities, trusted adults, support groups and responsive interventions together beyond the school day. It provides continuity, community and accessible routes into further support.",
  image: images.dropins,
  imageAlt:
    "Young people gathered in a relaxed community hub, representing safe space and belonging",
  logo: images.hubLogo,
  logoAlt: "Overflow Hub — Creating community",
  whyTitle: "Support should not stop at the school gate.",
  whyIntro:
    "Young people need positive places to go, things to do and people who know them. The Hub connects school sign-up with out-of-school opportunities and keeps relationships active beyond a single intervention.",
  features: [
    {
      icon: Coffee,
      title: "Welcome",
      text: "An informal, hospitable environment where young people can arrive, settle and take part.",
    },
    {
      icon: Home,
      title: "Belonging",
      text: "A consistent community base that helps reduce isolation and build positive relationships.",
    },
    {
      icon: HeartHandshake,
      title: "Relational support",
      text: "Trusted adults available for conversation, encouragement, mentoring and appropriate follow-up.",
    },
    {
      icon: Network,
      title: "Connected pathways",
      text: "Links into Dance, Create, Football, support groups and appropriately qualified specialist provision.",
    },
  ],
  flowTitle: "From participation to ongoing connection.",
  flowIntro:
    "The Hub is part of the wider school and community wellbeing partnership, not a standalone youth session.",
  steps: [
    {
      title: "Welcome",
      text: "Young people enter a safe, accessible community environment.",
    },
    {
      title: "Participate",
      text: "Activities and groups create shared experience and confidence.",
    },
    {
      title: "Be known",
      text: "Consistent adults build trust and notice strengths or emerging needs.",
    },
    {
      title: "Connect",
      text: "The team coordinates appropriate opportunities and support.",
    },
    {
      title: "Keep belonging",
      text: "Relationships continue beyond one activity, group or intervention.",
    },
  ],
};

export default function OverflowHubPage() {
  return <ProjectPage project={project} />;
}
