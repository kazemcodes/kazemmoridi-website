import { createFileRoute } from "@tanstack/react-router";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { pageHead } from "@/lib/seo";
import { contact, socials } from "@/content/studio";
import { PageHero, Section } from "@/components/primitives/layout";
import { ContactForm } from "@/components/sections/contact-form";

const title = { fa: "بیایید چیزی بسازیم.", en: "Let's build something." };
const lede = {
  fa: "فرم را پر کنید یا مستقیم در بله و تلگرام پیام دهید. ظرف ۲۴ ساعت پاسخ می‌دهیم.",
  en: "Fill in the form or message us on Bale or Telegram. We reply within 24 hours.",
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
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <ContactForm />
          </div>
          <aside className="space-y-10 md:col-span-4 md:col-start-9">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Email</div>
              <a href={`mailto:${contact.email}`} className="mt-2 block text-xl hover:text-ember" dir="ltr">{contact.email}</a>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Phone</div>
              <a href={`tel:${contact.phone}`} className="mt-2 block text-xl hover:text-ember" dir="ltr">{contact.phoneDisplay[locale]}</a>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{locale === "fa" ? "ساعت کاری" : "Hours"}</div>
              <p className="mt-2">{contact.hours[locale]}</p>
              <p className="mt-1 text-sm text-muted-foreground">{contact.location[locale]}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="inline-block rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-ember hover:text-ember">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
