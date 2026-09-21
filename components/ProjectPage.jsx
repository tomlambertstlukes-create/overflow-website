import Button from "@/components/Button";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import ProcessFlow from "@/components/ProcessFlow";
import ProjectCards from "@/components/ProjectCards";
import { contact } from "@/lib/data";

function ProjectTestimonial({ testimonial }) {
  if (!testimonial) return null;

  return (
    <section className="bg-[#f7efe7] px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        {testimonial.image && (
          <div className="overflow-hidden rounded-3xl bg-[#10253f] shadow-lg">
            <img
              src={testimonial.image}
              alt={testimonial.imageAlt || testimonial.title}
              className="h-full min-h-[320px] w-full object-cover"
            />
          </div>
        )}

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#10253f]/10 md:p-10">
          {testimonial.kicker && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d4146f]">
              {testimonial.kicker}
            </p>
          )}

          <h2 className="mb-6 text-3xl font-bold leading-tight text-[#10253f] md:text-5xl">
            {testimonial.title}
          </h2>

          <blockquote className="space-y-5 text-base leading-7 text-[#10253f] md:text-lg">
            {testimonial.quote && <p>“{testimonial.quote}</p>}

            {testimonial.highlight && (
              <p className="rounded-2xl bg-[#f7efe7] p-5 text-xl font-semibold leading-8 text-[#d4146f]">
                {testimonial.highlight}
              </p>
            )}

            {testimonial.closing && <p>{testimonial.closing}”</p>}
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export default function ProjectPage({ project }) {
  return (
    <>
      <Hero
        kicker={project.kicker}
        title={project.title}
        primary={<Button href={`mailto:${contact.email}`}>Talk to us</Button>}
        secondary={
          <Button href="/projects" variant="ghost">
            All projects
          </Button>
        }
        image={project.image}
        imageAlt={project.imageAlt}
        brandImage={project.logo}
        brandImageAlt={project.logoAlt}
      >
        {project.hero}
      </Hero>

      <FeatureGrid
        kicker="Why it matters"
        title={project.whyTitle}
        intro={project.whyIntro}
        features={project.features}
      />

      <ProcessFlow
        kicker="How it connects"
        title={project.flowTitle}
        intro={project.flowIntro}
        steps={project.steps}
      />

      <ProjectTestimonial testimonial={project.testimonial} />

      <ProjectCards />
    </>
  );
}
