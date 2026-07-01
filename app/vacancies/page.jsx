import {
  Briefcase,
  CalendarDays,
  FileText,
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

export const metadata = {
  title: "Vacancies | Kingdom Overflow",
  description:
    "Current vacancies at Kingdom Overflow, including the School & Community Relational Support Coordinator role.",
};

export default function VacanciesPage() {
  const roleTitle = "School & Community Relational Support Coordinator";

  return (
    <>
      <Hero
        kicker="Vacancies"
        title="Join us in building relational wellbeing provision for young people."
        primary={<Button href="#current-vacancy">View current vacancy</Button>}
        secondary={<Button href={`mailto:${contact.email}`} variant="ghost">Contact us</Button>}
        image={images.school || images.schools || images.church}
        imageAlt="Young people connecting through Kingdom Overflow provision"
      >
        We are inviting people to help create a replicable model of relational wellbeing provision that creates lasting change for young people, families and communities.
      </Hero>

      <section id="current-vacancy">
  <FeatureGrid
    kicker="Current vacancy"
    title={roleTitle}
    intro="A pioneering opportunity to help build connected networks of relationships, opportunities and support around young people across school and community settings."
    features={[
      {
        icon: MapPin,
        title: "Location",
        text: "London Borough of Havering.",
      },
      {
        icon: CalendarDays,
        title: "Hours",
        text: "40 hours per week, term time only, including some evenings and weekends.",
      },
      {
        icon: Briefcase,
        title: "Salary",
        text: "£30,840, paid as an academic contract based on £36,300 FTE.",
      },
      {
        icon: FileText,
        title: "Deadline",
        text: "Applications close on 3 July 2026 @9am. Interviews will take place on 6/7 July 2026.",
      },
    ]}
  />

  <section className="section" style={{ paddingTop: 0 }}>
    <div className="container">
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button href="/downloads/recruitment-pack.pdf">
          Download Recruitment Pack
        </Button>

        <Button href="/downloads/application-form.docx" variant="ghost">
          Download Application Form
        </Button>

        <Button
          href={`mailto:${contact.email}?subject=${encodeURIComponent(roleTitle)}`}
          variant="ghost"
        >
          Apply by Email
        </Button>
      </div>
    </div>
  </section>
</section>

      <FeatureGrid
        kicker="About the role"
        title="A pioneering role that helps build relational infrastructure around young people."
        intro="This role exists to connect school-based provision, community opportunities, projects and partnerships so young people can access support that is relational, personalised and joined up."
        features={[
          {
            icon: HandHeart,
            title: "Relational support",
            text: "Build familiarity, rapport and trusted relationships with young people through mentoring, listening spaces and consistent presence.",
          },
          {
            icon: School,
            title: "Overflow Hub",
            text: "Help develop school and community-based drop-in spaces that create belonging, participation and early access to support.",
          },
          {
            icon: Network,
            title: "Pathway development",
            text: "Coordinate personalised pathways, signposting and referrals so young people can access the right support at the right time.",
          },
          {
            icon: Users,
            title: "Partnership working",
            text: "Work with the wider Kingdom Overflow team, schools, volunteers, community organisations and specialist partners.",
          },
        ]}
      />

      <ProcessFlow
  kicker="How to apply"
  title="Download the documents and send your application."
  steps={[
    {
      title: "Read the pack",
      text: "Download and read the full recruitment pack before applying.",
    },
    {
      title: "Prepare your CV",
      text: "Include relevant employment, voluntary experience, qualifications and training.",
    },
    {
      title: "Write your statement",
      text: "Submit a supporting statement of no more than two A4 pages.",
    },
    {
      title: "Send application",
      text: `Email your CV, statement and completed application form to ${contact.email}.`,
    },
  ]}
/>

</>
  );
}
