import { ArrowRight, HeartHandshake, Network, School } from "lucide-react";
import Link from "next/link";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";

const delivery = [
  {
    icon: School,
    title: "School and community partnership",
    text: "Wellbeing support is embedded in school life and connected to relationships, opportunity and belonging beyond the school day.",
  },
  {
    icon: HeartHandshake,
    title: "Belonging before wellbeing",
    text: "Overflow Hub, Dance, Create and Football give young people somewhere to be, something to do and someone to talk to.",
  },
  {
    icon: Network,
    title: "Personalised, connected pathways",
    text: "We grow options, volunteers and specialist partnerships so support can be shaped around each young person and family.",
  },
];

export default function DeliveryNow() {
  return (
    <Section>
      <div className="rounded-[2rem] border border-pink-400/20 bg-gradient-to-br from-pink-500/15 via-white/[0.055] to-white/[0.025] p-7 sm:p-10">
        <div className="max-w-4xl">
          <Kicker>Overflow Wellbeing Centres</Kicker>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Overflow Wellbeing Centres are delivering in Havering.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/72">
            Our school and community wellbeing partnerships bring the Kingdom
            Overflow model to life: building trusted relationships, accessible
            opportunities and joined-up support around young people.
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
            <strong className="text-white">The goal is not simply more provision.</strong>{" "}
            It is support young people can actually reach, trust and use.
          </p>
          <Link
            href="/how-it-works"
            className="inline-flex shrink-0 items-center gap-2 font-bold text-pink-200 hover:text-pink-100"
          >
            Explore the model <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
