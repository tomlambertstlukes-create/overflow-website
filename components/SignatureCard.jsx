import { Activity, Network } from "lucide-react";
import { impactStats } from "@/lib/data";

export default function SignatureCard() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-pink-950/30 backdrop-blur">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="relative rounded-[1.5rem] bg-slate-950/70 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white/50">System dashboard</div>
            <div className="text-2xl font-black">Relational infrastructure works</div>
          </div>
          <Network className="text-pink-300" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {impactStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-brand-gradient text-4xl font-black">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-white/65">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-[#E2E2D2]/20 bg-[#E2E2D2]/10 p-5 text-sm leading-6 text-[#E2E2D2]">
          Schools + community + church + specialist pathways connected into one support ecosystem.
        </div>
      </div>
    </div>
  );
}