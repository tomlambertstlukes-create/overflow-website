import {
  BadgeCheck,
  ClipboardCheck,
  GraduationCap,
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
import SystemModel from "@/components/SystemModel";
import Kicker from "@/components/Kicker";
import { images } from "@/lib/data";

const leadershipTeam = [
  {
    name: "Tom Lambert",
    role: "Director of Kingdom Overflow",
    bio: "Tom leads Kingdom Overflow’s strategy, partnerships and development, bringing together schools, community provision, staff, volunteers, churches and specialist organisations around the vision of building relational infrastructure for young people.",
  },
  {
    name: "Jess Pickering",
    role: "School & Community Relational Support Coordinator",
    bio: "Jess brings extensive experience across teaching, pastoral care, safeguarding, attendance, reintegration and alternative provision. She builds positive relationships with young people, schools and families, particularly supporting those facing barriers to education and helping them recognise their worth and potential.",
  },
];

const principles = [
  {
    icon: HeartHandshake,
    title: "Belonging before wellbeing",
    text: "The antidote to isolation is connection. Somewhere to be, something to do and someone to talk to can become the doorway into deeper support.",
  },
  {
    icon: Users,
    title: "Rapport-led presence",
    text: "The answer is not simply more programmes. Consistent, trusted presence helps young people reach, trust and use support within the worlds they already inhabit.",
  },
  {
    icon: Network,
    title: "Built around the person",
    text: "Every young person is different. We grow options, opportunities and partnerships around their needs, strengths, aspirations and family circumstances—not ask them to fit a fixed programme.",
  },
  {
    icon: GraduationCap,
    title: "Embedded in school and community",
    text: "Trusted relationships begin where young people already are and remain available beyond the school gate, connecting daily school life with community belonging and opportunity.",
  },
];

const managementGroup = [
  {
    name: "John Baker",
    role: "Chair",
    image: "/images/team/john-baker.jpg",
    bio: "John brings more than 30 years’ experience in corporate banking and finance, alongside charity operations, organisational change and local voluntary-sector leadership.",
  },
  {
    name: "Trevor Bright",
    role: "Management Group",
  },
  {
    name: "Stuart Beck",
    role: "Education, Governance & Mental Health",
    bio: "Stuart brings more than 35 years’ experience in secondary education, including senior leadership, national education representation, governance, finance and major project delivery.",
  },
  {
    name: "Paul Rose",
    role: "Management Group",
  },
  {
    name: "Christine Rose",
    role: "Management Group",
  },
  {
    name: "Kim Elwell-Sutton",
    role: "Education, Governance & Mental Health",
    bio: "Kim brings experience across education, school and charity governance, mental health research and international teaching.",
  },
  {
    name: "Christine Jee",
    role: "Management Group",
  },
];

function Initials({ name }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/25 to-white/[0.055] text-4xl font-black text-pink-100"
    >
      {name
        .split(" ")
        .map((part) => part[0])
        .join("")}
    </div>
  );
}

export const metadata = {
  title: "About",
  description:
    "Meet the delivery and governance team behind Kingdom Overflow’s school and community wellbeing partnership in Havering.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        kicker="About Kingdom Overflow"
        title="Building support around young people—not asking young people to fit a programme."
        primary={<Button href="/schools">Partner with us</Button>}
        secondary={
          <Button href="/how-it-works" variant="ghost">
            See the model
          </Button>
        }
        image={images.mentoring}
        imageAlt="Trusted adults supporting young people through relational wellbeing work"
      >
        Kingdom Overflow builds relational infrastructure: the relationships,
        opportunities, partnerships and pathways that help young people access
        the right support at the right time—in and beyond the school day.
      </Hero>

      <Section>
        <div className="mb-10 max-w-4xl">
          <Kicker>What makes the model different</Kicker>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Connection is not an addition to support. It is the foundation that
            makes support possible.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/70">
            We do not begin with a pre-set programme. We begin with the young
            person, the relationships around them and the reality of their local
            community.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-7"
            >
              <principle.icon className="h-10 w-10 text-pink-300" />
              <h3 className="mt-5 text-2xl font-black">{principle.title}</h3>
              <p className="mt-3 leading-7 text-white/68">{principle.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <SystemModel />

      <Section>
        <div className="mb-10 max-w-4xl">
          <Kicker>Leadership and delivery</Kicker>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            A growing team connecting strategy, relationships and delivery.
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {leadershipTeam.map((person) => (
            <article
              key={person.name}
              className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.035] p-8 sm:p-10"
            >
              <div
                aria-hidden="true"
                className="flex h-24 w-24 items-center justify-center rounded-full bg-pink-400/15 text-2xl font-black text-pink-100"
              >
                {person.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <h3 className="mt-6 text-3xl font-black">{person.name}</h3>
              <p className="mt-2 font-bold text-pink-200">{person.role}</p>
              <p className="mt-5 text-lg leading-8 text-white/72">
                {person.bio}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-8 sm:p-12">
          <Kicker>Ethos and practice</Kicker>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Faith is why. Young person-centred practice is how.
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-white/75">
            Kingdom Overflow is rooted in Christian faith and a compassionate
            response to the needs of young people. Our support is inclusive,
            without pressure and centred on each young person’s dignity, voice,
            strengths, needs, relationships and choices.
          </p>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-white/70">
            We are committed to professional, trauma-informed and therapeutic
            practice, with clear safeguarding, supervision, accountability and
            boundaries. We work within the competence and qualifications of our
            team; counselling and clinical provision are developed through
            appropriately qualified partners.
          </p>
          <p className="mt-4 max-w-4xl leading-8 text-white/65">
            Kingdom Overflow operates as part of St Luke’s Cranham Park PCC,
            registered charity number 1128304. Information about our church
            context and faith pathways is available separately.
          </p>
          <div className="mt-8">
            <Button href="/churches" variant="ghost">
              Church and faith
            </Button>
          </div>
        </div>
      </Section>

      <FeatureGrid
        kicker="Governance and practice"
        title="Experienced oversight behind safe, credible delivery."
        intro="The management group brings together experience relevant to schools, wellbeing, community work, governance and sustainable charity delivery."
        features={[
          {
            icon: GraduationCap,
            title: "Education",
            text: "Understanding of school leadership, pastoral systems, curriculum and the pressures on staff.",
          },
          {
            icon: HeartHandshake,
            title: "Wellbeing",
            text: "Insight into relational, therapeutic and pastoral approaches while maintaining clear clinical boundaries.",
          },
          {
            icon: Network,
            title: "Partnership",
            text: "Experience of local systems, statutory services, community organisations and collaborative delivery.",
          },
          {
            icon: BadgeCheck,
            title: "Charity leadership",
            text: "Governance, finance, organisational development and accountability for sustainable growth.",
          },
          {
            icon: ShieldCheck,
            title: "Safeguarding",
            text: "Safeguarding, safer recruitment, supervision and clear escalation sit at the centre of delivery.",
          },
          {
            icon: ClipboardCheck,
            title: "Professional standards",
            text: "Policies and practice are designed for school-based work, information sharing and appropriate partnership provision.",
          },
          {
            icon: Users,
            title: "Community insight",
            text: "Long-term local relationships help the model respond to the realities young people and families face.",
          },
          {
            icon: Network,
            title: "Non-clinical coordination",
            text: "Kingdom Overflow does not currently provide clinical support directly; counselling and clinical provision are developed through qualified partners.",
          },
        ]}
      />

      <Section>
        <Kicker>Management Group</Kicker>
        <h2 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Oversight from people with relevant professional and community
          experience.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {managementGroup.map((person) => (
            <article
              key={person.name}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-48 w-full rounded-xl object-cover"
                />
              ) : (
                <Initials name={person.name} />
              )}
              <h3 className="mt-5 text-xl font-bold">{person.name}</h3>
              <p className="mt-1 text-sm font-semibold text-pink-300">
                {person.role}
              </p>
              {person.bio && (
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {person.bio}
                </p>
              )}
            </article>
          ))}
        </div>
      </Section>

      <ProcessFlow
        kicker="Governance in practice"
        title="How we keep the work safe, accountable and credible."
        intro="Governance supports school-embedded delivery, community activity, volunteer involvement and specialist partnerships."
        steps={[
          {
            title: "Oversight",
            text: "The management group provides leadership, accountability and strategic direction.",
          },
          {
            title: "Safeguarding",
            text: "Clear procedures, supervision and reporting routes protect young people, staff and volunteers.",
          },
          {
            title: "Partnership",
            text: "Schools and specialist partners agree roles, boundaries and information-sharing arrangements.",
          },
          {
            title: "Learning",
            text: "Reach, feedback, progress and partnership capacity inform improvement.",
          },
          {
            title: "Sustainability",
            text: "The model grows through volunteers, partnerships, funding and shared ownership.",
          },
        ]}
      />

      <Section>
        <div className="rounded-[2rem] border border-[#F300C5]/20 bg-gradient-to-br from-[#F300C5]/15 via-[#C51F5D]/10 to-white/[0.04] p-8 sm:p-12">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Help build the next stage.
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-white/75">
            We welcome conversations with schools, funders, community
            organisations, volunteers and appropriately qualified specialist
            partners who share the ambition for long-term change.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/schools">Partner with us</Button>
            <Button href="/funders" variant="ghost">
              Fund this work
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
