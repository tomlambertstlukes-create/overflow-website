import { Activity, BarChart3, HeartHandshake, Users } from "lucide-react";
import { images } from "@/lib/data";
import Hero from "@/components/Hero";
import Button from "@/components/Button";
import SignatureCard from "@/components/SignatureCard";
import ImpactStats from "@/components/ImpactStats";
import FeatureGrid from "@/components/FeatureGrid";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";

export default function ImpactPage() {
  return (
    <>
      <Hero
        kicker="Impact"
        title="Real change. Measured across the system."
        primary={<Button href="/funders">Fund this impact</Button>}
        secondary={<Button href="/how-it-works" variant="ghost">How it works</Button>}
        image={images.mentoring}
        imageAlt="A supportive mentoring conversation, representing relational impact"
      >
        We measure what changes when young people are seen, known, supported and connected — not just during a single intervention, but across the whole pathway.
      </Hero>

      <ImpactStats />

      <FeatureGrid
        kicker="What we track"
        title="A broader picture of wellbeing."
        features={[
          { icon: HeartHandshake, title: "Mental health", text: "Confidence, anxiety, resilience and emotional wellbeing." },
          { icon: Users, title: "Belonging", text: "Isolation, social connection and participation in positive community." },
          { icon: Activity, title: "Engagement", text: "Attendance, motivation, school participation and community involvement." },
          { icon: BarChart3, title: "Progress", text: "Feedback, intervention outcomes and long-term relational support." },
        ]}
      />

      <Section>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 sm:p-10">
          <Kicker>Stories</Kicker>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Add young people’s stories here.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
            This section should include short anonymised stories, school testimonials and quotes from young people, parents, staff and partners.
          </p>
        </div>
      </Section>
    </>
  );
}
