import {
  Bell,
  HandHeart,
  Network,
  School,
} from "lucide-react";
import { images, contact } from "@/lib/data";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";

export const metadata = {
  title: "Work With Us",
  description:
    "Current opportunities to work, volunteer or partner with Kingdom Overflow.",
};

export default function VacanciesPage() {
  return (
    <>
      <Hero
        kicker="Work with us"
        title="There are"
        titleAccent=" no current vacancies."
        primary={<Button href={`mailto:${contact.email}`}>Contact us</Button>}
        secondary={
          <Button href="/about" variant="ghost">
            Meet the team
          </Button>
        }
        image={images.mentoring}
        imageAlt="A trusted adult supporting a young person"
      >
        Our first School & Community Relational Support Coordinator is now in
        post. Future paid opportunities will be published here, but there are
        other ways to help build the support available around young people.
      </Hero>

      <FeatureGrid
        kicker="Other ways to contribute"
        title="Help strengthen the network."
        intro="Please contact us if you would like to explore one of these routes. All involvement is subject to the appropriate recruitment, safeguarding and partnership checks."
        features={[
          {
            icon: HandHeart,
            title: "Volunteer mentoring",
            text: "Express an interest in future training and supervised relational support opportunities.",
          },
          {
            icon: School,
            title: "School partnership",
            text: "Talk with us about developing a school and community wellbeing partnership.",
          },
          {
            icon: Network,
            title: "Specialist partnership",
            text: "Connect appropriate expertise or provision into a supported pathway for young people.",
          },
          {
            icon: Bell,
            title: "Future roles",
            text: "Check this page for approved vacancies as the team and delivery model grow.",
          },
        ]}
      />
    </>
  );
}
