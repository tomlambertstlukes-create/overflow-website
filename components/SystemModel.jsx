import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { systemLayers } from "@/lib/data";

export default function SystemModel() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <Kicker>Infrastructure model</Kicker>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">A whole-system approach to wellbeing.</h2>
        <p className="mt-5 text-lg leading-8 text-white/70">
          A connected pathway that meets young people before crisis, during support and beyond intervention.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-4">
        {systemLayers.map((layer) => (
          <div key={layer.title} className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-1">
            <div className={`absolute inset-y-0 left-0 w-2 bg-gradient-to-b ${layer.accent}`} />
            <div className="grid gap-4 p-5 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
              <div>
                <div className={`inline-flex rounded-full bg-gradient-to-r ${layer.accent} px-4 py-2 text-sm font-black text-slate-950`}>
                  {layer.title}
                </div>
                <h3 className="mt-4 text-2xl font-black">{layer.subtitle}</h3>
              </div>
              <p className="text-sm leading-7 text-white/65">{layer.detail}</p>
            </div>
          </div>
          ))}
      </div>
    </Section>
  );
}