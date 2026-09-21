import Section from "@/components/Section";
import Button from "@/components/Button";
import Kicker from "@/components/Kicker";
import { contact } from "@/lib/data";

const priorities = [
  "Sustain the school-embedded Relational Support Coordinator role.",
  "Recruit, train and support volunteer mentors.",
  "Develop Overflow Hub, Dance, Create and Football pathways.",
  "Build specialist partnerships and a strong evidence base.",
];

export default function CostBlock() {
  return (
    <Section>
      <div className="rounded-[2rem] border border-[#F300C5]/20 bg-gradient-to-br from-[#F300C5]/20 via-[#C51F5D]/10 to-white/[0.04] p-8 sm:p-14">
        <Kicker>Current funding priorities</Kicker>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Help strengthen and extend the system around young people.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              Flexible and multi-year funding helps Kingdom Overflow build
              capacity around need, rather than limiting support to one short
              programme or one member of staff.
            </p>
            <div className="mt-8">
              <Button href={`mailto:${contact.email}?subject=Funding%20Kingdom%20Overflow`}>
                Discuss funding
              </Button>
            </div>
          </div>
          <ul className="grid gap-3">
            {priorities.map((priority) => (
              <li
                key={priority}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 leading-7 text-white/75"
              >
                {priority}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
