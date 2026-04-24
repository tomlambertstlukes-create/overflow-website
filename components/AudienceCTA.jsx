import Link from "next/link";
import Section from "@/components/Section";
import { School, HandCoins, Church } from "lucide-react";

const audiences = [
  { icon: School, title: "For Schools", text: "Build a connected wellbeing system in your school.", href: "/schools" },
  { icon: HandCoins, title: "For Funders", text: "Invest in relational infrastructure with measurable impact.", href: "/funders" },
  { icon: Church, title: "For Churches", text: "Be part of a movement reconnecting a generation.", href: "/churches" },
];

export default function AudienceCTA() {
  return (
    <Section>
      <div className="grid gap-5 lg:grid-cols-3">
        {audiences.map((item) => (
          <Link key={item.title} href={item.href} className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-8 transition hover:-translate-y-1">
            <item.icon className="h-10 w-10 text-orange-200" />
            <h3 className="mt-5 text-2xl font-black">{item.title}</h3>
            <p className="mt-3 leading-7 text-white/65">{item.text}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}