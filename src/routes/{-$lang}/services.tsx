import { createFileRoute } from "@tanstack/react-router";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { pageHead } from "@/lib/seo";
import { services } from "@/content/services";
import { PageHero, Section } from "@/components/primitives/layout";
import { ServicesList } from "@/components/sections/services-list";
import { StatsBand } from "@/components/sections/stats-band";
import { CtaBand } from "@/components/sections/cta-band";

const title = { fa: "خدمات استودیو", en: "Studio services" };
const lede = {
  fa: "از استراتژی و طراحی تا مهندسی، استقرار و پشتیبانی — همه زیر یک سقف.",
  en: "From strategy and design to engineering, launch and care — all under one roof.",
};

export const Route = createFileRoute("/{-$lang}/services")({
  head: ({ params }) => pageHead(params.lang, title, lede),
  component: ServicesPage,
});

function ServicesPage() {
  const locale = useLocale();
  return (
    <>
      <PageHero eyebrow={d.nav.services[locale]} title={d.sections.services[locale]} lede={lede[locale]} />
      <Section className="pt-0 md:pt-0">
        <ServicesList services={services} />
      </Section>
      <StatsBand />
      <CtaBand />
    </>
  );
}
