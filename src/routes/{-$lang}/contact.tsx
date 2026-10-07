import { createFileRoute } from "@tanstack/react-router";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { pageHead } from "@/lib/seo";
import { PageHero, Section } from "@/components/primitives/layout";
import { ContactForm } from "@/components/sections/contact-form";
import { ContactChannels } from "@/components/sections/contact-channels";

const title = { fa: "بیایید چیزی بسازیم.", en: "Let's build something." };
const lede = {
  fa: "یک راه را انتخاب کنید: مستقیم پیام دهید یا فرم را پر کنید. ظرف ۲۴ ساعت پاسخ می‌دهیم.",
  en: "Pick a channel: message us directly or fill in the form. We reply within 24 hours.",
};

export const Route = createFileRoute("/{-$lang}/contact")({
  head: ({ params }) => pageHead(params.lang, { fa: "تماس با استودیو", en: "Contact" }, lede),
  component: ContactPage,
});

function ContactPage() {
  const locale = useLocale();
  return (
    <>
      <PageHero eyebrow={d.nav.contact[locale]} title={title[locale]} lede={lede[locale]} />
      <Section className="pt-0 md:pt-0">
        <ContactChannels />
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl bg-ember p-8 text-primary-foreground">
              <div className="text-sm text-primary-foreground/70">
                {locale === "fa" ? "چرا مستقیم پیام دهید؟" : "Why message directly?"}
              </div>
              <ul className="mt-5 space-y-4 text-sm leading-7">
                <li>{locale === "fa" ? "پاسخ ظرف ۲۴ ساعت، حتی تعطیلات" : "A reply within 24 hours, even on holidays"}</li>
                <li>{locale === "fa" ? "برآورد شفاف زمان و هزینه، بدون تعهد" : "Transparent time and cost estimate, no commitment"}</li>
                <li>{locale === "fa" ? "مشاوره اولیه رایگان برای شکل‌دادن به ایده" : "Free initial consultation to shape your idea"}</li>
              </ul>
              <div className="mt-8 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/70">
                {locale === "fa"
                  ? "ترجیح می‌دهید اول قیمت ببینید؟"
                  : "Prefer to see pricing first?"}{" "}
                <a href={locale === "fa" ? "/pricing" : "/en/pricing"} className="font-semibold text-primary-foreground underline underline-offset-4">
                  {locale === "fa" ? "محاسبه برآورد" : "Get an estimate"}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
