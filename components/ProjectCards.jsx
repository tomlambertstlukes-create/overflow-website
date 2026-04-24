import Link from "next/link";
import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import { images, projects } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export default function ProjectCards({ showHeader = true }) {
  return (
    <Section>
      {showHeader && (
        <div className="mb-10 max-w-3xl">
          <Kicker>Connected projects</Kicker>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">The projects that make the system work.</h2>
          <p className="mt-5 text-lg leading-8 text-white/70">
            Each project is a doorway into the wider pathway — creating belonging, trust, early support and long-term connection.
          </p>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.href} href={project.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 transition hover:-translate-y-1 hover:bg-white/[0.08]">
            {project.logo && <img src={project.logo} alt={project.title} className="mb-6 max-h-16 w-auto object-contain" />}
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#E2E2D2]">{project.tag}</div>
            <h3 className="mt-5 text-2xl font-black">{project.title}</h3>
            <p className="mt-4 leading-7 text-white/65">{project.summary}</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-pink-200">
              View project <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
           ))}
      </div>
    </Section>
  );
}