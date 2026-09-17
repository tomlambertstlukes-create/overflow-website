import { ArrowRight, MapPin, Network, Users } from "lucide-react";
import Link from "next/link";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";

const delivery = [
  {
    icon: MapPin,
    title: "School-embedded coordination",
    text: "Our first School & Community Relational Support Coordinator is now in post in Havering, building trusted presence and coordinating support around young people.",
  },
  {
    icon: Users,
    title: "Practical community pathways",
    text: "Overflow Dance, Overflow Create, Overflow Football and the Overflow Hub create routes into participation, confidence, belonging and ongoing relationships.",
  },
  {
    icon: Network,
    title: "Capacity through partnership",
    text: "The model recruits volunteers, develops mentors and connects specialist partners so support can expand around need.",
  },
];

export default function DeliveryNow() {
  return (
    <Section>
      <div className="rounded-[2rem] border border-pink-400/20 bg-gradient-to-br from-pink-500/15 via-white/[0.055] to-white/[0.025] p-7 sm:p-10">
        <div className="max-w-4xl">
          <Kicker>Now delivering in Havering</Kicker>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            The model is moving from vision into delivery.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/72">
            The Overflow Wellbeing Centre is a school and community wellbeing
            partnership. Its central school-embedded role connects the people,
            opportunities and specialist support already surrounding young
            people—and helps develop what is missing.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {delivery.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-6"
            >
              <item.icon className="h-9 w-9 text-pink-300" />
              <h3 className="mt-5 text-xl font-black">{item.title}</h3>
              <p className="mt-3 leading-7 text-white/65">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl leading-7 text-white/75">
            <strong className="text-white">Jess Pickering, our first RSC,</strong>{" "}
            brings extensive experience across teaching, pastoral care,
            safeguarding, attendance, reintegration and alternative provision.
          </p>
          <Link
            href="/about"
            className="inline-flex shrink-0 items-center gap-2 font-bold text-pink-200 hover:text-pink-100"
          >
            Meet the team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
