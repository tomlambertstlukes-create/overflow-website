import { MessageCircle, Network, ShieldCheck, Target } from "lucide-react";
import ProjectPage from "@/components/ProjectPage";
import { images } from "@/lib/data";

const project = {
  kicker: "Overflow Wellbeing Centres",
  title: "School-based infrastructure for whole-system wellbeing.",
  hero:
    "Relational Support Workers are embedded in schools to coordinate wellbeing support, build trust with young people and connect school provision into community projects and specialist pathways.",
  image: images.school,
  imageAlt: "A school-based mentoring conversation representing embedded relational support",
  whyTitle: "The coordinating role that helps the whole system connect.",
  whyIntro:
    "Many young people do not need one more disconnected referral. They need a trusted adult who can identify needs early, coordinate the right support and stay connected beyond a short intervention.",
  features: [
    { icon: ShieldCheck, title: "Visible support", text: "A trusted presence in school that young people know how to access." },
    { icon: MessageCircle, title: "Listening spaces", text: "Low-barrier conversations that make early help possible." },
    { icon: Target, title: "Bespoke interventions", text: "Support shaped around the needs of each school and individual." },
    { icon: Network, title: "Coordinated pathways", text: "Links into mentoring, counselling, community projects and external services." },
  ],
  flowTitle: "From school pressure to connected support.",
  flowIntro: "The Wellbeing Centre is the anchor point for the wider system.",
  steps: [
    { title: "Embed", text: "Build presence within school life and pastoral teams." },
    { title: "Listen", text: "Create safe, accessible spaces for young people to be heard." },
    { title: "Identify", text: "Spot needs early and understand what support is required." },
    { title: "Coordinate", text: "Connect young people to the right project, intervention or partner." },
    { title: "Sustain", text: "Keep long-term relational support around the young person." },
  ],
};

export default function WellbeingCentresPage() {
  return <ProjectPage project={project} />;
}