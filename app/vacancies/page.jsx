import {
  Briefcase,
  CalendarDays,
  Clock3,
  HandHeart,
  MapPin,
  Network,
  School,
  Users,
} from "lucide-react";
import { images, contact } from "@/lib/data";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import ProcessFlow from "@/components/ProcessFlow";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";

export const metadata = {
  title: "Relational Support Coordinator vacancy",
  description:
    "Apply to become Kingdom Overflow's next School & Community Relational Support Coordinator in Havering.",
};

export default function VacanciesPage() {
  const roleTitle = "School & Community Relational Support Coordinator";
  const applicationSubject = encodeURIComponent(`${roleTitle} application`);

  return (
    <>
      <Hero
        kicker="We're recruiting"
        title="Help build"
        titleAccent=" support around young people."
        primary={<Button href="#current-vacancy">View the role</Button>}
        secondary={
          <Button href="/downloads/recruitment-pack.pdf" variant="ghost">
            Download recruitment pack
          </Button>
        }
        image={images.school || images.mentoring}
        imageAlt="Young people connecting through Kingdom Overflow provision"
      >
        We are expanding our team and recruiting another School & Community
        Relational Support Coordinator to develop trusted relationships,
        connected pathways and accessible support across school and community
        settings in Havering.
      </Hero>

      <section id="current-vacancy">
        <FeatureGrid
          kicker="Current vacancy"
          title={roleTitle}
          intro="A pioneering opportunity combining direct relational support with the development of projects, partnerships and pathways that help young people belong, access support and thrive."
          features={[
            {
              icon: MapPin,
              title: "Location",
              text: "London Borough of Havering.",
            },
            {
              icon: Clock3,
              title: "Hours",
              text: "40 hours per week, term time only, including some evenings and weekends.",
            },
            {
              icon: Briefcase,
              title: "Salary",
              text: "£30,840 on an academic contract, based on £36,300 full-time equivalent.",
            },
            {
              icon: CalendarDays,
              title: "Key dates",
              text: "Applications close at 9am on Monday 14 December 2026. Interviews will be held on Thursday 17 and/or Friday 18 December.",
            },
          ]}
        />

        <div className="mx-auto -mt-8 flex max-w-7xl flex-col gap-3 px-5 pb-12 sm:flex-row sm:flex-wrap lg:px-8">
          <Button href="/downloads/recruitment-pack.pdf" download>
            Download recruitment pack
          </Button>
          <Button
            href="/downloads/application-form.docx"
            variant="ghost"
            download
          >
            Download application form
          </Button>
          <Button
            href={`mailto:${contact.email}?subject=${applicationSubject}`}
            variant="ghost"
          >
            Apply by email
          </Button>
        </div>
      </section>

      <FeatureGrid
        kicker="About the role"
        title="Build relational infrastructure around young people."
        intro="This is both a support role and a development role. The postholder will work directly with young people while strengthening the relationships, opportunities and pathways available around them."
        features={[
          {
            icon: HandHeart,
            title: "Relational support",
            text: "Develop trust through mentoring, listening spaces, groups, workshops and a consistent presence with young people.",
          },
          {
            icon: School,
            title: "Wellbeing Centres",
            text: "Develop school-based drop-ins, early support and links between school provision and wider Kingdom Overflow projects.",
          },
          {
            icon: Network,
            title: "Connected pathways",
            text: "Coordinate referrals and partnerships so young people can reach the right support and opportunity at the right time.",
          },
          {
            icon: Users,
            title: "Community capacity",
            text: "Build community provision and recruit, train and support volunteers, mentors and listeners alongside the wider team.",
          },
        ]}
      />

      <ProcessFlow
        kicker="How to apply"
        title="Send us all three application documents."
        intro="Please read the recruitment pack in full before applying."
        steps={[
          {
            title: "Read the pack",
            text: "Review the role description, person specification and important recruitment information.",
          },
          {
            title: "Complete the form",
            text: "Download and complete the Kingdom Overflow application form.",
          },
          {
            title: "Prepare your CV",
            text: "Include your current employment, relevant experience, qualifications and training.",
          },
          {
            title: "Write your cover letter",
            text: "Use no more than two sides of A4 to respond to the points set out in the recruitment pack.",
          },
          {
            title: "Email your application",
            text: `Send your application form, CV and cover letter to ${contact.email} by 9am on 14 December.`,
          },
        ]}
      />

      <Section className="pt-4">
        <div className="rounded-[2rem] border border-pink-300/20 bg-gradient-to-br from-[#F300C5]/15 via-white/[0.055] to-[#243447]/45 p-7 sm:p-10">
          <Kicker>Before you apply</Kicker>
          <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
            Applications close at 9am on 14 December 2026.
          </h2>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/70">
            Interviews will take place on Thursday 17 and/or Friday 18
            December. There is an occupational requirement for the postholder
            to be a practising Christian. Appointment is subject to satisfactory
            references, identity checks and an Enhanced DBS check.
          </p>
          <p className="mt-4 max-w-4xl leading-7 text-white/65">
            For an informal conversation about the role, contact Tom Lambert,
            Director of Kingdom Overflow, on 01708 222562 or email {contact.email}.
          </p>
          <div className="mt-8">
            <Button href={`mailto:${contact.email}?subject=${applicationSubject}`}>
              Apply by email
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
