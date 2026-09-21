import {
  Activity,
  BarChart3,
  HeartHandshake,
  Network,
  Users,
} from "lucide-react";
import { images } from "@/lib/data";
import Hero from "@/components/Hero";
import Button from "@/components/Button";
import FeatureGrid from "@/components/FeatureGrid";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";

export const metadata = {
  title: "Impact and Learning",
  description:
    "How Kingdom Overflow will measure reach, belonging, engagement, progress and the capacity built around young people.",
};

export default function ImpactPage() {
  return (
    <>
      <Hero
        kicker="Impact and learning"
        title="Measure what changes"
        titleAccent="—and learn what needs to change."
        primary={<Button href="/funders">Fund this work</Button>}
        secondary={
          <Button href="/how-it-works" variant="ghost">
            How it works
          </Button>
        }
        image={images.mentoring}
        imageAlt="A supportive mentoring conversation, representing relational impact"
      >
        Our current delivery is establishing a clear evidence base from the
        outset. We will measure individual experience and the wider system around
        young people, using verified data rather than projections presented as
        outcomes.
      </Hero>

      <FeatureGrid
        kicker="What we track"
        title="A broader picture of wellbeing and connection."
        intro="Measures are proportionate to the support being offered and developed with schools and partners. Personal information is handled safely, and public learning is anonymised."
        features={[
          {
            icon: Users,
            title: "Reach and access",
            text: "Who participates, how young people enter the pathway and where barriers remain.",
          },
          {
            icon: HeartHandshake,
            title: "Wellbeing and belonging",
            text: "Young people’s experience of confidence, connection, trusted relationships and support.",
          },
          {
            icon: Activity,
            title: "Engagement and progress",
            text: "Participation in school and community life, feedback and progress against agreed goals.",
          },
          {
            icon: Network,
            title: "System capacity",
            text: "Volunteers recruited, partnerships developed and additional support opportunities created.",
          },
        ]}
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 sm:p-10">
            <Kicker>Evidence as delivery grows</Kicker>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              A transparent starting point.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              As the Relational Support Coordinator and Overflow Wellbeing Centre
              model develop, we will publish verified reach and outcome data,
              learning from schools and partners, and appropriately consented,
              anonymised stories.
            </p>
          </div>
          <div className="rounded-[2rem] border border-pink-400/20 bg-pink-400/10 p-8 sm:p-10">
            <BarChart3 className="h-10 w-10 text-pink-200" />
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Learning is part of the model.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              We will use evidence to improve delivery, understand gaps and show
              funders and schools what is changing. We will not publish
              unsupported percentages or treat activity counts alone as proof of
              impact.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
