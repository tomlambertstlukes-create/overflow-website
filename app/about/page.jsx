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
import Kicker from "@/components/Kicker";
import { images } from "@/lib/data";

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
        title="Building the relational infrastructure around young people."
        primary={<Button href="/schools">Partner with us</Button>}
        secondary={
          <Button href="/how-it-works" variant="ghost">
            See the model
          </Button>
        }
        image={images.mentoring}
        imageAlt="Trusted adults supporting young people through relational wellbeing work"
      >
        Kingdom Overflow brings schools, families, community activity,
        volunteers and specialist partners into a connected system of
        belonging, opportunity and support. The work is now being delivered in
        Havering through our first school and community wellbeing partnership.
      </Hero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-pink-400/20 bg-pink-400/10 p-8">
            <Kicker>Delivery leadership</Kicker>
            <div
              aria-hidden="true"
              className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-950/55 text-3xl font-black text-pink-100"
            >
              JP
            </div>
            <h2 className="mt-6 text-3xl font-black">Jess Pickering</h2>
            <p className="mt-2 font-bold text-pink-200">
              School & Community Relational Support Coordinator
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 sm:p-10">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Extensive experience across education and alternative provision.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/75">
              Jess brings extensive experience across teaching, pastoral care,
              safeguarding, attendance, reintegration and alternative provision.
              She is passionate about building positive relationships with young
              people, schools and families, particularly supporting those facing
              barriers to education and helping them recognise their worth and
              potential.
            </p>
            <p className="mt-4 text-lg leading-8 text-white/70">
              As the central school-embedded post, Jess coordinates the wider
              team’s involvement and works collegiately with school staff,
              volunteers, community projects and specialist partners to expand
              the support available around need.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-8 sm:p-12">
          <Kicker>Ethos</Kicker>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Faith is the why. Young person-centred practice is the focus.
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-white/75">
            Kingdom Overflow is rooted in Christian faith and a compassionate
            response to the needs of young people. In schools and community
            settings, provision is inclusive, professionally accountable and
            shaped around the young person—their voice, strengths, needs,
            relationships and choices.
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
