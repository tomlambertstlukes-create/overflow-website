import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { systemLayers } from "@/lib/data";

export default function SystemModel() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <Kicker>The Overflow model</Kicker>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
          Building support around each young person.
        </h2>
        <p className="mt-5 text-lg leading-8 text-white/70">
          Every young person is different. Effective support starts by
          understanding their needs, strengths, aspirations and circumstances—
          then building the right response around them.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-pink-400/25 bg-gradient-to-br from-pink-500/20 to-white/[0.045] p-7 text-center sm:p-9">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-pink-200">
          Young people at the centre
        </div>
        <h3 className="mt-3 text-3xl font-black">
          Seen, known, valued, supported and able to thrive.
        </h3>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/70">
          The person does not fit a programme. Relationships, opportunities,
          partnerships and pathways are shaped around the person.
        </p>
      </div>

      <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-2">
        {systemLayers.map((layer) => (
          <div
            key={layer.title}
            className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-1"
          >
            <div className={`absolute inset-y-0 left-0 w-2 bg-gradient-to-b ${layer.accent}`} />
            <div className="p-6">
              <div
                className={`inline-flex rounded-full bg-gradient-to-r ${layer.accent} px-4 py-2 text-sm font-black text-slate-950`}
              >
                {layer.title}
              </div>
              <h3 className="mt-4 text-2xl font-black">{layer.subtitle}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                {layer.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-5xl rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-7 sm:flex sm:items-center sm:gap-8">
        <div className="shrink-0 text-xl font-black text-pink-200">
          Working across school and community
        </div>
        <p className="mt-3 leading-7 text-white/70 sm:mt-0">
          School-embedded presence is connected to community-based pathways and
          opportunities, so trusted relationships and support remain available
          beyond the school gate.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-5xl border-t border-pink-400/25 pt-6 text-center">
        <p className="text-lg font-bold text-white/85">
          Relational infrastructure is the network of relationships,
          opportunities, partnerships and pathways that helps young people
          access the right support at the right time.
        </p>
      </div>
    </Section>
  );
}
