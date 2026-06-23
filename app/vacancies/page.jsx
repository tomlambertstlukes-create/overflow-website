import {
  Briefcase,
  CalendarDays,
  FileText,
  HandHeart,
  MapPin,
  Network,
  School,
  Users,
  Mail,
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
            text: "Applications close on 3 July 2026. Interviews will take place on 6/7 July 2026.",
          },
        ]}
      />

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
      title: "Download the pack",
      text: "Read the full recruitment pack before applying.",
    },
    {
      title: "Complete the form",
      text: "Complete the application form and prepare your CV.",
    },
    {
      title: "Write your statement",
      text: "Submit a supporting statement of no more than two A4 pages.",
    },
    {
      title: "Send application",
      text: `Email your CV, statement and application form to ${contact.email}.`,
    },
  ]}
/>

<section className="section">
  <div className="container">
    <div className="button-row">
      <Button href="/downloads/recruitment-pack.pdf">
        Download recruitment pack
      </Button>
      <Button href="/downloads/application-form.docx" variant="ghost">
        Download application form
      </Button>
      <Button href={`mailto:${contact.email}`} variant="ghost">
        Email application
      </Button>
    </div>
  </div>
</section>

      <FeatureGrid
        kicker="A note to applicants"
        title="Experience develops through different routes."
        intro="If you are excited by the vision, can demonstrate strong relational capability and believe you could contribute to this growing work, we encourage you to apply."
        features={[
          {
            icon: HandHeart,
            title: "Relational capability",
            text: "We are interested in people who can build trust, listen well and create safe spaces for young people.",
          },
          {
            icon: Network,
            title: "Transferable experience",
            text: "Relevant experience may come through youth work, education, counselling, mentoring, community work, ministry or volunteering.",
          },
          {
            icon: Users,
            title: "Shared vision",
            text: "We are looking for people who want to help young people belong, access support and realise their potential.",
          },
          {
            icon: Mail,
            title: "Informal conversation",
            text: `For an informal conversation, contact ${contact.email}.`,
          },
        ]}
      />
    </>
  );
}