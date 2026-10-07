import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { cn } from "@/lib/utils";
import { StudioButton } from "@/components/primitives/button";
import { Magnetic } from "@/components/motion/magnetic";
import { LocaleLink, LocaleSwitch, type SitePath } from "./locale-link";
import { Wordmark } from "./wordmark";

const NAV: { to: SitePath; key: keyof typeof d.nav }[] = [
  { to: "/{-$lang}/services", key: "services" },
  { to: "/{-$lang}/work", key: "work" },
  { to: "/{-$lang}/process", key: "process" },
  { to: "/{-$lang}/pricing", key: "pricing" },
  { to: "/{-$lang}/about", key: "about" },
];

export function SiteHeader() {
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[1440px] items-center justify-between rounded-full px-5 transition-all duration-500 md:px-7",
          scrolled ? "border border-line bg-background/70 backdrop-blur-xl" : "border border-transparent",
        )}
      >
        <LocaleLink to="/{-$lang}" aria-label="KM Studio" onClick={() => setOpen(false)}>
          <Wordmark />
        </LocaleLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <LocaleLink
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "!text-foreground" }}
            >
              {d.nav[n.key][locale]}
            </LocaleLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch
            target={locale === "fa" ? "en" : "fa"}
            className="grid h-10 w-10 place-items-center rounded-full border border-line font-mono text-xs transition-colors hover:border-ember hover:text-ember"
          />
          <Magnetic className="hidden md:inline-block">
            <StudioButton asChild size="sm">
              <LocaleLink to="/{-$lang}/contact">{d.cta.start[locale]}</LocaleLink>
            </StudioButton>
          </Magnetic>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={cn("block h-px w-4 bg-foreground transition-transform", open && "translate-y-[3px] rotate-45")} />
            <span className={cn("-mt-3 block h-px w-4 bg-foreground transition-transform", open && "-translate-y-[3px] -rotate-45")} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-auto mt-2 flex max-w-[1440px] flex-col rounded-3xl border border-line bg-surface p-4 lg:hidden"
          >
            {[...NAV, { to: "/{-$lang}/contact" as SitePath, key: "contact" as const }].map((n) => (
              <LocaleLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-line px-2 py-4 font-display text-2xl last:border-0"
              >
                {d.nav[n.key][locale]}
              </LocaleLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
