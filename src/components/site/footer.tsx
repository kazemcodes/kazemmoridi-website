import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { contact, socials } from "@/content/studio";
import { Container } from "@/components/primitives/layout";
import { LocaleLink } from "./locale-link";

export function SiteFooter() {
  const locale = useLocale();
  return (
    <footer className="relative overflow-hidden border-t border-line pt-20">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-2xl leading-snug">{d.footer.tagline[locale]}</p>
            <a href={`mailto:${contact.email}`} className="mt-6 inline-block text-ember hover:underline" dir="ltr">
              {contact.email}
            </a>
            <p className="mt-2 text-muted-foreground" dir="ltr">{contact.phoneDisplay[locale]}</p>
          </div>
          <nav className="grid grid-cols-2 gap-3 text-sm md:col-span-4">
            {(["services", "work", "process", "pricing", "about", "contact"] as const).map((k) => (
              <LocaleLink key={k} to={`/{-$lang}/${k}`} className="text-muted-foreground transition-colors hover:text-foreground">
                {d.nav[k][locale]}
              </LocaleLink>
            ))}
          </nav>
          <ul className="space-y-3 text-sm md:col-span-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-ember">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-2 border-t border-line py-6 font-mono text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} KM Studio. {d.footer.rights[locale]}</span>
          <span>{contact.location[locale]}</span>
        </div>
      </Container>
      <div dir="ltr" className="pointer-events-none select-none whitespace-nowrap text-center text-[22vw] font-bold leading-snug text-surface-2" aria-hidden>
        KM Studio
      </div>
    </footer>
  );
}
