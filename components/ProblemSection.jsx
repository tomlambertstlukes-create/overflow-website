import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import ImagePanel from "@/components/ImagePanel";
import { images } from "@/lib/data";

const priorities = [
  {
    title: "Earlier help",
    text: "Visible, trusted support makes it easier to respond before needs escalate.",
  },
  {
    title: "Connected provision",
    text: "Schools, families, activities and specialist partners work as one pathway around the young person.",
  },
  {
    title: "Long-term belonging",
    text: "Relationships and community continue before, during and beyond a single intervention.",
  },
];

export default function ProblemSection() {
  return (
    <Section className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <div>
        <Kicker>The challenge</Kicker>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
          Young people are falling through fragmented systems.
        </h2>
        <p className="mt-6 text-lg leading-8 text-white/70">
          Support often exists in disconnected parts: schools under pressure,
          services stretched, thresholds rising and community spaces becoming
          harder to access. The issue is not only a lack of programmes—it is a
          lack of connected infrastructure around young people.
        </p>
        <div className="mt-8 grid gap-4">
          {priorities.map((priority) => (
            <div
              key={priority.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6"
            >
              <h3 className="text-xl font-black text-pink-200">{priority.title}</h3>
              <p className="mt-2 leading-7 text-white/65">{priority.text}</p>
            </div>
          ))}
        </div>
      </div>
      <ImagePanel
        src={images.problem}
        alt="A young person alone, representing fragmented support"
        caption="Support exists, but too often it is fragmented, delayed and disconnected."
      />
    </Section>
  );
}
