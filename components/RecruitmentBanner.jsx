import { BriefcaseBusiness } from "lucide-react";
import Button from "@/components/Button";

export default function RecruitmentBanner() {
  return (
    <section className="relative border-y border-pink-300/20 bg-gradient-to-r from-[#F300C5]/16 via-[#C51F5D]/12 to-[#243447]/35">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-2xl border border-pink-200/20 bg-pink-300/10 p-3 text-pink-200">
            <BriefcaseBusiness className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-pink-200">
              We&apos;re recruiting
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              School &amp; Community Relational Support Coordinator
            </h2>
            <p className="mt-2 text-base text-white/70">
              Applications close at 9am on Monday 14 December 2026.
            </p>
          </div>
        </div>
        <Button href="/vacancies" className="shrink-0">
          View the vacancy
        </Button>
      </div>
    </section>
  );
}
