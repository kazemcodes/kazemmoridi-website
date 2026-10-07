import { createFileRoute } from "@tanstack/react-router";
import { dictionary as d } from "@/i18n/dictionary";
import { toFaDigits, useLocale } from "@/i18n/locale";
import { pageHead } from "@/lib/seo";
import { about, capabilities } from "@/content/studio";
import { PageHero, Section } from "@/components/primitives/layout";
import { Reveal } from "@/components/motion/reveal";
import { Marquee } from "@/components/motion/marquee";
import { StatsBand } from "@/components/sections/stats-band";
import { CtaBand } from "@/components/sections/cta-band";

const lede = {
  fa: "طراحی و مهندسی وب از جنوب ایران، برای کسب‌وکارهای سراسر کشور.",
  en: "Web design and engineering from southern Iran, for businesses everywhere.",
};

export const Route = createFileRoute("/{-$lang}/about")({
  head: ({ params }) => pageHead(params.lang, { fa: "درباره استودیو", en: "About the studio" }, lede),
  component: AboutPage,
});

function AboutPage() {
  const locale = useLocale();
  return (
    <>
      <PageHero eyebrow={d.nav.about[locale]} title={about.title[locale]} lede={lede[locale]} />
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-6 text-xl leading-relaxed md:col-span-7 md:col-start-6 md:text-2xl">
            {about.body[locale].map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-24 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-3">
          {about.principles.map((pr, i) => (
            <Reveal key={i} delay={i * 0.08} className="bg-background p-8 md:p-10">
              <span className="font-mono text-xs text-ember">{locale === "fa" ? toFaDigits(`0${i + 1}`) : `0${i + 1}`}</span>
              <h3 className="mt-6 font-display text-2xl">{pr.title[locale]}</h3>
              <p className="mt-3 text-muted-foreground">{pr.body[locale]}</p>
            </Reveal>
          ))}
        </div>
      </Section>
      <div className="border-y border-line py-6 font-display text-4xl text-muted-foreground md:text-6xl">
        <Marquee items={capabilities} />
      </div>
      <StatsBand />
      <CtaBand />
    </>
  );
}
