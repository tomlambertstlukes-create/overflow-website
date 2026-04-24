import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { impactStats } from "@/lib/data";

export default function ImpactStats() {
  return (
    <Section>
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Kicker>Impact</Kicker>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">When support is relational and connected, outcomes change.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {impactStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] bg-slate-950/70 p-6">
                <div className="text-5xl font-black text-white">{stat.value}</div>
                <div className="mt-2 text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}