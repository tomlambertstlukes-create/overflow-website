import Link from "next/link";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { School, Users, Church, ChevronRight } from "lucide-react";

const items = [
  { icon: School, title: "Schools", text: "Embedded relational presence, early identification and coordinated wellbeing support.", href: "/schools", colour: "#E2E2D2" },
  { icon: Users, title: "Community", text: "Drop-ins, sport, dance, arts and safe spaces where belonging is experienced beyond school.", href: "/projects", colour: "#F300C5" },
  { icon: Church, title: "Church", text: "Long-term relationships, identity, purpose and pathways into faith, discipleship and leadership.", href: "/churches", colour: "#C51F5D" },
];

export default function Pillars() {
  return (
    <Section>
      <div className="mb-10 max-w-3xl">
        <Kicker>Connected ecosystem</Kicker>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">The overlap is the strategy.</h2>
        <p className="mt-5 text-lg leading-8 text-white/70">
          Schools, community and church are not separate workstreams. They are the connected infrastructure that keeps young people seen, known and supported.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item) => (
             <Link key={item.title} href={item.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 transition hover:-translate-y-1 hover:bg-white/[0.08]">
            <item.icon className="h-10 w-10" style={{ color: item.colour }} />
            <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
            <p className="mt-4 leading-7 text-white/65">{item.text}</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#E2E2D2]">
              Explore <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
