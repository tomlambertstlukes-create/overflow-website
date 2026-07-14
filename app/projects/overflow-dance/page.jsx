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

  testimonial: {
  kicker: "Overflow Success Stories",
  title: "Overflow Dance helped me find my voice",
  image: "/images/overflow-dance-story.jpg",
  imageAlt: "Young person involved in Overflow Dance",
  quote:
    "When I first started Overflow Dance, I was very quiet and shy. I found it difficult to be myself. Over time, I started to find my voice. I became a little more goofy, started renaming dance moves, and my personality began to show. As my confidence grew, I began speaking, choreographing, performing and leading workshops. I now work as a host at Parkdean Resorts, where I dance, host activities and do so much more.",
  highlight:
    "I struggle with anxiety, but when I’m at Overflow Dance it feels like it disappears. I can be myself here, and that makes me so happy.",
  closing:
    "When I look back at where I was when I first came to Overflow at 16, and where I am now, I can see how much Overflow Dance has impacted my life. I love coming back to visit, teach and share my story. I hope I can inspire more young people and show them that no matter who you are or where you’re from, you are always welcome here.",
},

export default function OverflowDancePage() {
  return <ProjectPage project={project} />;
}