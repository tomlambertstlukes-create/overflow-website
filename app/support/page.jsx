import { HeartHandshake, Mail } from "lucide-react";
import Button from "@/components/Button";
import Kicker from "@/components/Kicker";
import RelatedLinks from "@/components/RelatedLinks";
import Section from "@/components/Section";
import { contact } from "@/lib/data";

const givingUrl =
  "https://kingdomoverflow.churchsuite.com/donate/fund/bbc6p0ie";

const updatesUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
  "Join Kingdom Overflow updates",
)}&body=${encodeURIComponent(
  "Please add me to the Kingdom Overflow updates list. I understand that I can unsubscribe at any time.",
)}`;

export const metadata = {
  title: "Support Us",
  description:
    "Support Kingdom Overflow through a one-off or regular gift, or join our occasional updates.",
};

export default function SupportPage() {
  return (
    <>
      <Section className="pb-12 pt-16 sm:pt-20">
        <div className="max-w-4xl">
          <Kicker>Support Kingdom Overflow</Kicker>
          <h1 className="text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
            Help build a community where
            <span className="text-[var(--primary)]"> young people belong.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/72 sm:text-xl">
            Whether you give, stay connected or both, you are helping build
            trusted relationships, earlier support and positive community around
            young people in Havering.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="flex h-full flex-col rounded-[2rem] border border-[#F300C5]/25 bg-gradient-to-br from-[#F300C5]/15 via-[#C51F5D]/10 to-white/[0.04] p-8 sm:p-10">
            <HeartHandshake className="h-11 w-11 text-pink-200" />
            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
              Give to Kingdom Overflow
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/72">
              One-off and regular gifts help sustain school-embedded relational
              support and community projects that create belonging, opportunity
              and wellbeing.
            </p>
            <div className="mt-auto pt-8">
              <Button
                href={givingUrl}
                aria-label="Give securely through ChurchSuite (opens in a new tab)"
              >
                Give securely
              </Button>
              <p className="mt-5 text-sm leading-6 text-white/50">
                Giving is processed through ChurchSuite. Kingdom Overflow
                operates as part of St Luke’s Cranham Park PCC, registered
                charity number 1128304.
              </p>
            </div>
          </article>

          <article className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-8 sm:p-10">
            <Mail className="h-11 w-11 text-[var(--cream)]" />
            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
              Join our updates
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/72">
              Receive occasional news about the work, what we are learning and
              practical opportunities to support Kingdom Overflow.
            </p>
            <div className="mt-auto pt-8">
              <Button href={updatesUrl} variant="ghost">
                Ask to join the list
              </Button>
              <p className="mt-5 text-sm leading-6 text-white/50">
                Email us to opt in to Kingdom Overflow updates. You can
                unsubscribe at any time.
              </p>
            </div>
          </article>
        </div>
      </Section>

      <RelatedLinks
        kicker="See the work"
        title="Understand what your support makes possible."
        intro="Explore the connected projects creating routes into belonging and support, or see how Kingdom Overflow will measure and share its impact."
        links={[
          { href: "/projects", label: "Explore the projects" },
          { href: "/impact", label: "See our approach to impact" },
        ]}
      />
    </>
  );
}
