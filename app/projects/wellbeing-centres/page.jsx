import {
  MessageCircle,
  Network,
  ShieldCheck,
  Target,
} from "lucide-react";
import ProjectPage from "@/components/ProjectPage";
import { images } from "@/lib/data";

export const metadata = {
  title: "Overflow Wellbeing Centre | Kingdom Overflow",
  description:
    "A school and community wellbeing partnership led by a school-embedded School & Community Relational Support Coordinator.",
};

const project = {
  kicker: "Overflow Wellbeing Centre",
  title: "A school and community wellbeing partnership built around young people.",
  hero:
    "A school-embedded School & Community Relational Support Coordinator (RSC) works with schools, families, community projects, volunteers and specialist partners to increase and connect the support available around young people.",
  image: images.school,
  imageAlt:
    "A school-based mentoring conversation representing school-embedded relational support",
  whyTitle: "The coordinating role that helps the whole system connect.",
  whyIntro:
    "The RSC is the central school-embedded post, supported by the School & Community Dance, Create and Football Coordinators. The role develops relationships, grows capacity and helps the right support form around each young person.",
  features: [
    {
      icon: ShieldCheck,
      title: "Known presence",
      text: "A trusted professional within school life who works alongside pastoral teams and the nominated school link.",
    },
    {
      icon: MessageCircle,
      title: "Relational support",
      text: "Accessible listening, mentoring, individual and group support shaped around identified need.",
    },
    {
      icon: Target,
      title: "Responsive provision",
      text: "Assemblies, curriculum-linked PSHE and interventions developed with the school.",
    },
    {
      icon: Network,
      title: "Coordinated pathways",
      text: "Connections into community activities, volunteer mentors, families and appropriately qualified specialist partners.",
    },
  ],
  flowTitle: "From school presence to a stronger network.",
  flowIntro:
    "The aim is not for the RSC to do all the work. The role expands the opportunities, people and partnerships available around need.",
  steps: [
    {
      title: "Embed",
      text: "Build a consistent presence within school life and pastoral systems.",
    },
    {
      title: "Listen",
      text: "Understand young people’s strengths, needs and priorities.",
    },
    {
      title: "Respond",
      text: "Offer appropriate non-clinical individual, group and universal support.",
    },
    {
      title: "Coordinate",
      text: "Bring together community pathways, volunteers and specialist partners.",
    },
    {
      title: "Grow capacity",
      text: "Recruit mentors, develop partnerships and increase the support available over time.",
    },
  ],
};

export default function WellbeingCentresPage() {
  return <ProjectPage project={project} />;
}
