import Section from "@/components/Section";
import Kicker from "@/components/Kicker";
import ImagePanel from "@/components/ImagePanel";
import type { ReactNode } from "react";

type HeroProps = {
  kicker?: string;
  title: string;
  children: ReactNode;
  primary?: ReactNode;
  secondary?: ReactNode;
  visual?: ReactNode;
  image?: string;
  imageAlt?: string;
};

export default function Hero({
  kicker,
  title,
  children,
  primary,
  secondary,
  visual = null,
  image,
  imageAlt = "Overflow wellbeing work with young people",
}: HeroProps) {
  return (
    <Section className="grid min-h-[78vh] items-center gap-12 pt-16 lg:grid-cols-[1.08fr_0.92fr]">
      <div>
        {kicker && <Kicker>{kicker}</Kicker>}

        <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>

        <div className="mt-7 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
          {children}
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          {primary}
          {secondary}
        </div>

        <div className="mt-10 flex items-center gap-3 text-sm font-semibold text-white/60">
  <span>Scroll to explore</span>
  <span className="animate-bounce text-2xl">↓</span>
</div>

      </div>

      {image ? (
        <ImagePanel src={image} alt={imageAlt} />
      ) : (
        visual && <div>{visual}</div>
      )}
    </Section>
  );
}