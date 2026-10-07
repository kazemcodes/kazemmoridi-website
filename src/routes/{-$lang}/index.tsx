import { createFileRoute } from "@tanstack/react-router";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { pageHead } from "@/lib/seo";
import { services } from "@/content/services";
import { featuredProjects } from "@/content/projects";
import { Section } from "@/components/primitives/layout";
import { StudioButton } from "@/components/primitives/button";
import { Hero } from "@/components/sections/hero";
import { ServicesList } from "@/components/sections/services-list";
import { WorkGrid } from "@/components/sections/project-card";
import { StatsBand } from "@/components/sections/stats-band";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBand } from "@/components/sections/cta-band";
import { LocaleLink } from "@/components/site/locale-link";

export const Route = createFileRoute("/{-$lang}/")({
  head: ({ params }) =>
    pageHead(
      params.lang,
      { fa: "استودیو طراحی و توسعه وب", en: "Web design & engineering studio" },
      {
        fa: "KM Studio فروشگاه اینترنتی، سامانه اختصاصی و اپلیکیشن سریع و امن برای کسب‌وکارها و مدارس می‌سازد.",
        en: "KM Studio designs and builds fast, secure online stores, custom platforms and apps for businesses and schools.",
      },
    ),
  component: Home,
});

function Home() {
  const locale = useLocale();
  return (
    <>
      <Hero />
      <Section index="01" eyebrow={d.nav.services[locale]} title={d.sections.services[locale]}>
        <ServicesList services={services} />
      </Section>
      <Section
        index="02"
        eyebrow={d.nav.work[locale]}
        title={d.sections.work[locale]}
        aside={
          <StudioButton asChild variant="line" size="sm">
            <LocaleLink to="/{-$lang}/work">{d.cta.allWork[locale]}</LocaleLink>
          </StudioButton>
        }
      >
        <WorkGrid projects={featuredProjects()} />
      </Section>
      <StatsBand />
      <Section index="03" eyebrow={d.nav.process[locale]} title={d.sections.process[locale]}>
        <ProcessTimeline compact />
      </Section>
      <Section index="04" eyebrow="—" title={d.sections.voices[locale]}>
        <Testimonials />
      </Section>
      <CtaBand />
    </>
  );
}
