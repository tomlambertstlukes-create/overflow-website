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
            text: "Applications close on 30 June 2026. Interviews will take place on 3 July 2026.",
          },
        ]}
      />

      <section id="current-vacancy" className="section">
        <div className="container">
          <div className="card">
            <p className="kicker">About the role</p>
            <h2>{roleTitle}</h2>
            <p>
              This role exists to help build relational infrastructure around young people through school and community-based settings, projects and partnerships.
            </p>
            <p>
              By combining relational support, coordinated pathway development and community engagement, the postholder will help create personalised responses that enable young people to belong, access support and thrive.
            </p>

            <div className="button-row">
              <Button href="/downloads/recruitment-pack.pdf">Download recruitment pack</Button>
              <Button href="/downloads/application-form.docx" variant="ghost">
                Download application form
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FeatureGrid
        kicker="The role in practice"
        title="A role that connects support around young people."
        intro="This is not simply a role that delivers interventions. It helps build the relationships, pathways, projects and partnerships that make long-term wellbeing support possible."
        features={[
          {
            icon: HandHeart,
            title: "Relational support",
            text: "Build familiarity, rapport and trusted relationships through mentoring, listening spaces and informal wellbeing support.",
          },
          {
            icon: School,
            title: "School-based presence",
            text: "Develop Overflow Hub provision and support a whole-school culture of wellbeing and belonging.",
          },
          {
            icon: Network,
            title: "Connected pathways",
            text: "Coordinate referrals, signposting and personalised pathways into wider support.",
          },
          {
            icon: Users,
            title: "Community partnerships",
            text: "Work with the wider Kingdom Overflow team, volunteers, schools, community organisations and specialist partners.",
          },
        ]}
      />

      <ProcessFlow
        kicker="Application process"
        title="How to apply."
        steps={[
          {
            title: "Read the pack",
            text: "Download the recruitment pack and application form.",
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
            text: `Email your CV, statement and application form to ${contact.email}.`,
          },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="card accent">
            <p className="kicker">A note to applicants</p>
            <h2>Experience develops through different routes.</h2>
            <p>
              If you are excited by the vision, can demonstrate strong relational capability and believe you could contribute to this growing work, we encourage you to apply.
            </p>
            <Button href={`mailto:${contact.email}?subject=${encodeURIComponent(roleTitle)}`}>
              Apply by email
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}