import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { contact } from "@/content/studio";
import { Container } from "@/components/primitives/layout";
import { StudioButton } from "@/components/primitives/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { LocaleLink } from "@/components/site/locale-link";

export function CtaBand() {
  const locale = useLocale();
  return (
    <section className="grain relative overflow-hidden py-32 md:py-48">
      <div className="ember-glow pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-5xl font-display text-5xl font-semibold leading-[1] md:text-8xl">{d.ctaBand.title[locale]}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">{d.ctaBand.body[locale]}</p>
        </Reveal>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <StudioButton asChild size="lg" data-cursor="Hi">
              <LocaleLink to="/{-$lang}/contact">{d.cta.start[locale]}</LocaleLink>
            </StudioButton>
          </Magnetic>
          <StudioButton asChild size="lg" variant="line">
            <a href={contact.bale} target="_blank" rel="noreferrer">Bale ↗</a>
          </StudioButton>
        </div>
      </Container>
    </section>
  );
}
