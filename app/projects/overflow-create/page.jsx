import { Brush, Heart, MessageCircle, Users } from "lucide-react";
import ProjectPage from "@/components/ProjectPage";
import { images } from "@/lib/data";

const project = {
  kicker: "Overflow Create",
  title: "A creative wellbeing pathway through art, expression and connection.",
  hero:
    "Overflow Create helps young people express themselves, build self-worth and access support through creativity, relationship and positive community.",
  image: images.create,
  imageAlt: "Young people making art together, representing creativity, self-expression and support",
  whyTitle: "Creativity opens conversations that might otherwise stay hidden.",
  whyIntro:
    "Art and making can help young people process emotions, explore identity and connect with trusted adults in a non-threatening environment.",
  features: [
    { icon: Brush, title: "Expression", text: "Creative activity gives young people language beyond words." },
    { icon: Heart, title: "Self-worth", text: "Making and sharing builds confidence, agency and identity." },
    { icon: MessageCircle, title: "Conversation", text: "Creative spaces allow supportive conversations to happen naturally." },
    { icon: Users, title: "Community", text: "Group projects reduce isolation and create positive peer connection." },
  ],
  flowTitle: "From creative expression to connected support.",
  flowIntro:
    "Create is part of the wider infrastructure because it turns participation into relationship and relationship into support.",
  steps: [
    { title: "Create", text: "Young people engage through art and practical creativity." },
    { title: "Express", text: "They explore feelings, identity and story in a safe way." },
    { title: "Connect", text: "Trusted leaders build relationship around the activity." },
    { title: "Support", text: "Needs can be identified and linked into wider help." },
    { title: "Belong", text: "Young people become part of a positive creative community." },
  ],
};

export default function OverflowCreatePage() {
  return <ProjectPage project={project} />;
}