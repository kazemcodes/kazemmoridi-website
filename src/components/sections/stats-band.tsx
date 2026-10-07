import { useLocale } from "@/i18n/locale";
import { stats } from "@/content/studio";
import { Container } from "@/components/primitives/layout";
import { Reveal } from "@/components/motion/reveal";

export function StatsBand() {
  const locale = useLocale();
  return (
    <section className="border-y border-line bg-surface">
      <Container className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08} className="border-line py-12 [&:not(:last-child)]:border-e md:py-16 md:ps-8">
            <div className="font-display text-5xl font-semibold text-ember md:text-7xl">{s.value[locale]}</div>
            <div className="mt-3 text-sm text-muted-foreground">{s.label[locale]}</div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
