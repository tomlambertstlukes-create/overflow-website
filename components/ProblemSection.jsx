import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import ImagePanel from "@/components/ImagePanel";
import { images } from "@/lib/data";

function MiniStat({ value, label }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur">
      <div className="text-4xl font-black text-pink-300">{value}</div>
      <p className="mt-2 text-sm leading-6 text-white/65">{label}</p>
    </div>
  );
}

export default function ProblemSection() {
  return (
    <Section className="grid gap-10 lg:grid-cols-2">
      <div>
        <Kicker>System failure</Kicker>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
          Young people are falling through fragmented systems.
        </h2>
        <p className="mt-6 text-lg leading-8 text-white/70">
          Support often exists in disconnected parts: schools under pressure, services stretched, thresholds rising, community spaces disappearing and young people waiting until crisis. The issue is not only lack of programmes — it is lack of connected infrastructure.
        </p>
      </div>
      <div className="grid gap-4">
        <ImagePanel
        src={images.problem}
          alt="A young person alone, representing fragmented support and waiting until crisis"
          caption="Support exists, but too often it is fragmented, delayed and disconnected."
        />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <MiniStat value="1 in 6" label="young people experience symptoms of anxiety or depression" />
          <MiniStat value="54%" label="of local CAMHS referrals aged 11–18 reported as rejected" />
          <MiniStat value="70%+" label="cuts to youth services in England and Wales" />
        </div>
      </div>
    </Section>
  );
}