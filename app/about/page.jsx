import {
  BadgeCheck,
  Church,
  ClipboardCheck,
  HeartHandshake,
  Network,
  ShieldCheck,
  Users,
} from "lucide-react";

import Button from "@/components/Button";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import ProcessFlow from "@/components/ProcessFlow";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { images } from "@/lib/data";

export default function AboutPage() {
  return (
    <>
      <Hero
        kicker="About & Governance"
        title="Experienced leadership for infrastructure-level change."
        primary={<Button href="/funders">Partner with us</Button>}
        secondary={
          <Button href="/how-it-works" variant="ghost">
            See the system
          </Button>
        }
        image={images.mentoring}
        imageAlt="Trusted adults supporting young people through relational wellbeing work"
      >
        Building a system that changes the landscape of youth mental health
        requires more than good ideas. It requires trusted governance,
        experienced oversight and safe, accountable delivery.
      </Hero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Kicker>Who we are</Kicker>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Part of St Luke’s Cranham Park PCC.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/70">
              Kingdom Overflow is part of St Luke’s Cranham Park PCC,
              registered charity number 1128304. Our work has grown from a
              long-term commitment to young people, local mission and
              community-based wellbeing.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8">
            <h3 className="text-2xl font-black">Why governance matters</h3>
            <p className="mt-4 leading-8 text-white/70">
              We are not simply running activities. We are building relational
              infrastructure across schools, community spaces, churches and
              specialist support. That means safeguarding, accountability,
              professional standards and experienced leadership need to sit at
              the centre of the model.
            </p>
          </div>
        </div>
      </Section>

      <FeatureGrid
        kicker="Management Group"
        title="Oversight from people with relevant experience."
        intro="Kingdom Overflow is managed and overseen by a management group with experience across the fields needed for safe, credible and scalable delivery."
        features={[
          {
            icon: Users,
            title: "Youth work",
            text: "Experience in engaging young people, developing participation and creating trusted relationships.",
          },
          {
            icon: ClipboardCheck,
            title: "Education",
            text: "Understanding of schools, pastoral systems, curriculum links and the pressures on teaching staff.",
          },
          {
            icon: HeartHandshake,
            title: "Psychotherapy",
            text: "Insight into emotional wellbeing, therapeutic support and safe practice around young people’s needs.",
          },
          {
            icon: Network,
            title: "Local authority",
            text: "Experience of local systems, partnerships and the wider landscape of statutory and community provision.",
          },
          {
            icon: BadgeCheck,
            title: "Charity leadership",
            text: "Governance, funding, organisational development and accountability for long-term sustainability.",
          },
          {
            icon: Church,
            title: "Church leadership",
            text: "Oversight rooted in local church mission, pastoral care and long-term community presence.",
          },
          {
            icon: ShieldCheck,
            title: "Safeguarding culture",
            text: "Safe delivery is central to working with young people across schools, community and church settings.",
          },
          {
            icon: ClipboardCheck,
            title: "Professional standards",
            text: "Policies and governance are developed for work in education and counselling contexts.",
          },
        ]}
      />

      <ProcessFlow
        kicker="Governance in practice"
        title="How we keep the work safe, accountable and credible."
        intro="Our governance supports the whole system: from school-based delivery to community hubs, church-based pathways and specialist partnerships."
        steps={[
          {
            title: "Oversight",
            text: "A management group provides leadership, accountability and strategic direction.",
          },
          {
            title: "Policies",
            text: "Governance and policies are in place for education and counselling-related work.",
          },
          {
            title: "Partnership",
            text: "We work with schools, churches and wellbeing partners so support is joined up.",
          },
          {
            title: "Measurement",
            text: "Impact is tracked through attendance, feedback, school reports and progress data.",
          },
          {
            title: "Sustainability",
            text: "The model is designed to become replicable, sustainable and scalable over time.",
          },
        ]}
      />

      <Section>
        <div className="rounded-[2rem] border border-[#F300C5]/20 bg-gradient-to-br from-[#F300C5]/15 via-[#C51F5D]/10 to-white/[0.04] p-8 sm:p-12">
          <Kicker>Our accountability</Kicker>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Built to be trusted by schools, funders, churches and families.
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-white/75">
            Our aim is to change the landscape of youth mental health by
            creating a connected system of support around young people. To do
            that well, we need strong governance, clear accountability and
            experienced leadership behind every project, partnership and
            intervention.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/funders">Fund this work</Button>
            <Button href="/projects" variant="ghost">
              View projects
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}