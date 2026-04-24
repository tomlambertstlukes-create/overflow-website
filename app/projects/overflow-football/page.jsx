import { Activity, HeartHandshake, Shield, Users } from "lucide-react";
import ProjectPage from "@/components/ProjectPage";
import { images } from "@/lib/data";

const project = {
  kicker: "Overflow Football",
  title: "A sport-based wellbeing pathway for belonging, mentoring and confidence.",
  hero:
    "Overflow Football uses sport to engage young people, build trust and connect them into long-term support — especially those who may not access traditional wellbeing spaces.",
  image: images.football,
  imageAlt: "Young people playing football together, representing teamwork, mentoring and belonging",
  whyTitle: "Football creates a trusted route into relationship.",
  whyIntro:
    "For many young people, sport is the easiest doorway into belonging, confidence and conversation. It gives leaders a natural setting to build trust and offer support.",
  features: [
    { icon: Activity, title: "Physical wellbeing", text: "Sport supports confidence, fitness, motivation and mental health." },
    { icon: Users, title: "Belonging", text: "Teams and sessions create community for young people who may feel isolated." },
    { icon: Shield, title: "Safe engagement", text: "Football offers a low-pressure way to connect with trusted adults." },
    { icon: HeartHandshake, title: "Mentoring", text: "Coaches can provide encouragement, support and links into wider provision." },
  ],
  flowTitle: "From the pitch to the wider pathway.",
  flowIntro:
    "Football is both a participation project and a strategic wellbeing intervention.",
  steps: [
    { title: "Engage", text: "Young people connect through something familiar and enjoyable." },
    { title: "Trust", text: "Coaches build consistent relationships over time." },
    { title: "Support", text: "Needs are noticed and young people are encouraged toward help." },
    { title: "Connect", text: "Participants are linked into mentoring, drop-ins or specialist support." },
    { title: "Develop", text: "Young people grow in leadership, responsibility and confidence." },
  ],
};

export default function OverflowFootballPage() {
  return <ProjectPage project={project} />;
}