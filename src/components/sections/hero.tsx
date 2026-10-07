import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { capabilities } from "@/content/studio";
import { Container, Chip } from "@/components/primitives/layout";
import { StudioButton } from "@/components/primitives/button";
import { Reveal } from "@/components/motion/reveal";
import { Marquee } from "@/components/motion/marquee";
import { HeroVisual } from "@/components/three/hero-visual";
import { LocaleLink } from "@/components/site/locale-link";
import { StatBadge } from "@/components/primitives/stat-badge";

function Arrow() {
  return (
    <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

export function Hero() {
  const locale = useLocale();
  const [l1, l2, l3] = d.hero.title[locale];
  const [accent, ...rest] = (l1 ?? "").split(" ").reverse();
  return (
    <section className="relative overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-40">
      <div className="pointer-events-none absolute -top-40 end-0 h-[520px] w-[520px] rounded-full bg-cyan-soft blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 start-0 h-[600px] w-[600px] rounded-full bg-ember-soft blur-3xl" aria-hidden />

      <Container className="relative grid items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <Reveal>
            <Chip pulse>{d.hero.eyebrow[locale]}</Chip>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-5xl font-bold leading-[1.25] lg:text-7xl">
              {rest.reverse().join(" ")} <span className="text-ember">{accent}</span>
              <br />
              {l2}
              <br />
              {l3}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-xl leading-relaxed text-muted-foreground">{d.hero.lede[locale]}</p>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-wrap items-center gap-4 pt-2">
            <StudioButton asChild variant="bone" size="lg">
              <LocaleLink to="/{-$lang}/work">
                {d.hero.viewAll[locale]}
                <Arrow />
              </LocaleLink>
            </StudioButton>
            <StudioButton asChild variant="line" size="lg">
              <LocaleLink to="/{-$lang}/pricing">{d.hero.estimate[locale]}</LocaleLink>
            </StudioButton>
          </Reveal>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-lg">
          <HeroVisual />
          <StatBadge
            className="absolute -bottom-6 start-0 lg:-start-8"
            value={d.hero.statValue[locale]}
            label={d.hero.statLabel[locale]}
          />
        </div>
      </Container>

      <div className="mt-24 border-t border-line pt-10">
        <Container>
          <p className="mb-6 text-sm text-muted-foreground">{d.hero.stack[locale]}</p>
        </Container>
        <div dir="ltr" className="text-2xl font-bold text-foreground/30 md:text-3xl">
          <Marquee items={capabilities} />
        </div>
      </div>
    </section>
  );
}
