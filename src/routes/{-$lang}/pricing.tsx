import { createFileRoute } from "@tanstack/react-router";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { pageHead } from "@/lib/seo";
import { PageHero, Section } from "@/components/primitives/layout";
import { PricingCalculator } from "@/components/sections/pricing-calculator";

const title = { fa: "برآورد هزینه پروژه", en: "Estimate your project" };
const lede = {
  fa: "نوع پروژه و امکانات را انتخاب کنید تا برآورد اولیه زمان و هزینه را ببینید.",
  en: "Pick a project type and add-ons to see an initial time and cost estimate.",
};

export const Route = createFileRoute("/{-$lang}/pricing")({
  head: ({ params }) => pageHead(params.lang, title, lede),
  component: PricingPage,
});

function PricingPage() {
  const locale = useLocale();
  return (
    <>
      <PageHero eyebrow={d.nav.pricing[locale]} title={title[locale]} lede={lede[locale]} />
      <Section className="pt-0 md:pt-0">
        <PricingCalculator />
      </Section>
    </>
  );
}
