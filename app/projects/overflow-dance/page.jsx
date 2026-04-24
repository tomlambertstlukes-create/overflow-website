import { Heart, Sparkles, Users, Zap } from "lucide-react";
import ProjectPage from "@/components/ProjectPage";
import { images } from "@/lib/data";

const project = {
  kicker: "Overflow Dance",
  title: "A creative wellbeing pathway through movement, confidence and belonging.",
  hero:
    "Overflow Dance is not just a dance project. It is a doorway into positive community, self-expression, confidence and long-term relational support.",
  image: images.dance,
  imageAlt: "Young people dancing together, representing creativity, confidence and belonging",
  whyTitle: "Dance helps young people express what they cannot always say.",
  whyIntro:
    "Creative movement creates confidence, friendship and a sense of belonging — especially for young people who may not naturally access traditional wellbeing support.",
  features: [
    { icon: Sparkles, title: "Creative expression", text: "Young people explore identity, confidence and emotion through movement." },
    { icon: Users, title: "Positive community", text: "Groups create friendship, belonging and reduced isolation." },
    { icon: Heart, title: "Wellbeing through creativity", text: "Dance links physical, emotional and social wellbeing." },
    { icon: Zap, title: "Leadership pathways", text: "Young people can grow into peer support, coaching and leadership." },
  ],
  flowTitle: "From participation to support.",
  flowIntro:
    "Dance creates the relationship and trust that make deeper support possible.",
  steps: [
    { title: "Invite", text: "Young people join through school, community or peer connection." },
    { title: "Belong", text: "A safe creative group builds friendship and confidence." },
    { title: "Notice", text: "Trusted leaders spot needs and start supportive conversations." },
    { title: "Support", text: "Young people are linked into mentoring, wellbeing support or groups." },
    { title: "Lead", text: "Participants can grow into young leaders and peer encouragers." },
  ],
};

export default function OverflowDancePage() {
  return <ProjectPage project={project} />;
}