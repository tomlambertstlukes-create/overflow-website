import Section from "@/components/Section";
import Kicker from "@/components/Kicker";

export default function FeatureGrid({ kicker, title, intro, features }) {
  return (
    <Section>
      <div className="mb-10 max-w-3xl">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{title}</h2>
        {intro && <p className="mt-5 text-lg leading-8 text-white/70">{intro}</p>}
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6">
            {feature.icon && <feature.icon className="mb-5 h-9 w-9 text-pink-300" />}
            <h3 className="text-xl font-black">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">{feature.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}