import { createFileRoute } from "@tanstack/react-router";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { pageHead } from "@/lib/seo";
import { PageHero, Section } from "@/components/primitives/layout";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CtaBand } from "@/components/sections/cta-band";

const lede = {
  fa: "پنج مرحله شفاف، با تحویل‌دادنی مشخص در هر قدم — بدون غافلگیری.",
  en: "Five transparent stages, each with clear deliverables — no surprises.",
};

export const Route = createFileRoute("/{-$lang}/process")({
  head: ({ params }) => pageHead(params.lang, { fa: "فرآیند کار", en: "Process" }, lede),
  component: ProcessPage,
});

function ProcessPage() {
  const locale = useLocale();
  return (
    <>
      <PageHero eyebrow={d.nav.process[locale]} title={d.sections.process[locale]} lede={lede[locale]} />
      <Section className="pt-0 md:pt-0">
        <ProcessTimeline />
      </Section>
      <CtaBand />
    </>
  );
}
