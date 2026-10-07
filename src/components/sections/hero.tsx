import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { capabilities } from "@/content/studio";
import { Container, Eyebrow } from "@/components/primitives/layout";
import { StudioButton } from "@/components/primitives/button";
import { LineReveal, Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { HeroVisual } from "@/components/three/hero-visual";
import { LocaleLink } from "@/components/site/locale-link";

export function Hero() {
  const locale = useLocale();
  return (
    <section className="grain relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="ember-glow pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="absolute inset-0 md:start-[35%]">
        <HeroVisual />
      </div>

      <Container className="relative z-10 flex flex-1 flex-col justify-end pb-16 pt-36 md:pb-24">
        <Eyebrow>{d.hero.eyebrow[locale]}</Eyebrow>
        <h1 className="mt-8 max-w-5xl font-display text-[13vw] font-semibold leading-[0.95] md:text-[7.2vw]">
          <LineReveal lines={d.hero.title[locale]} delay={0.15} />
        </h1>
        <div className="mt-10 grid items-end gap-8 md:grid-cols-12">
          <Reveal delay={0.5} className="md:col-span-5">
            <p className="text-lg leading-relaxed text-muted-foreground">{d.hero.lede[locale]}</p>
          </Reveal>
          <Reveal delay={0.6} className="md:col-span-7 md:justify-self-end">
            <Magnetic>
              <StudioButton asChild size="lg" data-cursor="Go">
                <LocaleLink to="/{-$lang}/contact">
                  {d.cta.start[locale]}
                  <span className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
                </LocaleLink>
              </StudioButton>
            </Magnetic>
          </Reveal>
        </div>
      </Container>

      <div className="relative z-10 border-y border-line py-5 font-display text-2xl text-muted-foreground md:text-3xl">
        <Marquee items={capabilities} />
      </div>
    </section>
  );
}
