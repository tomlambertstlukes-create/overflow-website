import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { CircleDot } from "lucide-react";

export default function JourneySection() {
  const steps = [
    { title: "Seen", text: "A young person is noticed before crisis." },
    { title: "Known", text: "Trusted adults build relationship over time." },
    { title: "Supported", text: "The right support becomes accessible." },
    { title: "Connected", text: "They are linked into community and belonging." },
    { title: "Thriving", text: "Confidence, resilience and purpose grow." },
  ];

  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <Kicker>The young person’s journey</Kicker>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">From falling through gaps to finding belonging.</h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 text-center">
            <CircleDot className="mx-auto mb-4 text-pink-300" />
            <div className="text-sm text-white/40">0{index + 1}</div>
            <div className="mt-1 text-xl font-black">{step.title}</div>
            <p className="mt-3 text-sm leading-6 text-white/60">{step.text}</p>
          </div>
           ))}
      </div>
    </Section>
  );
}