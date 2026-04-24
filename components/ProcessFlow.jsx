import Section from "@/components/Section";
import Kicker from "@/components/Kicker";

export default function ProcessFlow({ kicker = "Process", title, intro, steps }) {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <Kicker>{kicker}</Kicker>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{title}</h2>
        {intro && <p className="mt-5 text-lg leading-8 text-white/70">{intro}</p>}
      </div>
      <div className="mt-12 grid gap-4 lg:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6">
            <div className="text-sm font-black text-pink-300">0{index + 1}</div>
            <h3 className="mt-3 text-xl font-black">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">{step.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}