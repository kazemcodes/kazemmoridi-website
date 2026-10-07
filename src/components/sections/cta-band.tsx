import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { contact } from "@/content/studio";
import { Container } from "@/components/primitives/layout";
import { StudioButton } from "@/components/primitives/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { LocaleLink } from "@/components/site/locale-link";
import { ProjectInquiryForm } from "@/components/sections/project-inquiry-form";

export function CtaBand({ inquiry = false }: { inquiry?: boolean }) {
  const locale = useLocale();
  const actions = (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Magnetic>
        <StudioButton asChild size="lg" variant="bone">
          <LocaleLink to="/{-$lang}/contact">{d.cta.start[locale]}</LocaleLink>
        </StudioButton>
      </Magnetic>
      <StudioButton asChild size="lg" variant="line" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:border-primary-foreground">
        <a href={contact.bale} target="_blank" rel="noreferrer">Bale ↗</a>
      </StudioButton>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-ember py-20 text-primary-foreground md:py-28">
      <div className="pointer-events-none absolute -top-24 end-0 h-80 w-80 rounded-full bg-primary-foreground/10 blur-2xl" aria-hidden />
      <Container className="relative text-center">
        {inquiry ? (
          <div className="grid gap-14 text-start md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/70">{d.ctaBand.inquiryTitle[locale]}</p>
                <h2 className="mt-4 text-4xl font-bold leading-snug md:text-5xl">{d.ctaBand.title[locale]}</h2>
                <p className="mt-6 max-w-md text-lg text-primary-foreground/85">{d.ctaBand.body[locale]}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-10 flex flex-wrap items-center gap-4">{actions}</div>
              </Reveal>
            </div>
            <Reveal delay={0.15} className="md:col-span-7">
              <ProjectInquiryForm />
            </Reveal>
          </div>
        ) : (
          <>
            <Reveal>
              <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-snug md:text-6xl">{d.ctaBand.title[locale]}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-8 max-w-xl text-lg text-primary-foreground/85">{d.ctaBand.body[locale]}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-12">{actions}</div>
            </Reveal>
          </>
        )}
      </Container>
    </section>
  );
}
