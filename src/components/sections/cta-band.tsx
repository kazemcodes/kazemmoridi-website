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
    <section className="relative overflow-hidden bg-ember py-20 text-primary-foreground md:py-28">
      <div className="pointer-events-none absolute -top-24 end-0 h-80 w-80 rounded-full bg-primary-foreground/10 blur-2xl" aria-hidden />
      <Container className="relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-snug md:text-6xl">{d.ctaBand.title[locale]}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-primary-foreground/85">{d.ctaBand.body[locale]}</p>
        </Reveal>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <StudioButton asChild size="lg" variant="bone">
              <LocaleLink to="/{-$lang}/contact">{d.cta.start[locale]}</LocaleLink>
            </StudioButton>
          </Magnetic>
          <StudioButton asChild size="lg" variant="line" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:border-primary-foreground">
            <a href={contact.bale} target="_blank" rel="noreferrer">Bale ↗</a>
          </StudioButton>
        </div>
      </Container>
    </section>
  );
}
