import Button from "@/components/Button";
import Kicker from "@/components/Kicker";
import Section from "@/components/Section";

export default function RelatedLinks({ kicker, title, intro, links }) {
  return (
    <Section className="pt-0">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-8 sm:p-10">
        <div className="max-w-4xl">
          <Kicker>{kicker}</Kicker>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            {title}
          </h2>
          {intro && (
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">
              {intro}
            </p>
          )}
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {links.map((link, index) => (
            <Button
              key={link.href}
              href={link.href}
              variant={index === 0 ? "primary" : "ghost"}
            >
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
}
