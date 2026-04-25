import Section from "@/components/Section";
import Button from "@/components/Button";
import { contact } from "@/lib/data";

export default function CostBlock() {
  return (
    <Section>
      <div className="rounded-[2rem] border border-[#F300C5]/20 bg-gradient-to-br from-[#F300C5]/20 via-[#C51F5D]/10 to-white/[0.04] p-8 text-center sm:p-14">
        <div className="text-sm font-black uppercase tracking-[0.25em] text-[#E2E2D2]">Current funding opportunity</div>
        <div className="mt-5 text-6xl font-black sm:text-8xl">£29,684</div>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
          Funds one Relational Support Worker for a year — creating visible, trusted support across school and community settings.
        </p>
        <div className="mt-8">
          <Button href={`mailto:${contact.email}`}>Fund a role</Button>
        </div>
      </div>
    </Section>
  );
}