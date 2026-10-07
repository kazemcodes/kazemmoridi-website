import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLocale, toFaDigits } from "@/i18n/locale";
import type { Service } from "@/content/services";
import { Tag } from "@/components/primitives/layout";
import { cn } from "@/lib/utils";

/** Editorial accordion list: one row per service, expands on hover/focus. */
export function ServicesList({ services, defaultOpen = 0 }: { services: Service[]; defaultOpen?: number }) {
  const locale = useLocale();
  const [open, setOpen] = useState<number>(defaultOpen);
  return (
    <ul className="border-b border-line">
      {services.map((s, i) => {
        const active = open === i;
        const n = String(i + 1).padStart(2, "0");
        return (
          <li key={s.id} className="border-t border-line" onMouseEnter={() => setOpen(i)}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-expanded={active}
              className="grid w-full grid-cols-12 items-center gap-4 py-7 text-start md:py-9"
            >
              <span className="col-span-2 font-mono text-xs text-muted-foreground md:col-span-1">
                {locale === "fa" ? toFaDigits(n) : n}
              </span>
              <span
                className={cn(
                  "col-span-9 font-display text-2xl font-medium transition-colors duration-300 md:col-span-8 md:text-5xl",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.title[locale]}
              </span>
              <span
                className={cn(
                  "col-span-1 justify-self-end text-2xl transition-transform duration-500 md:col-span-3",
                  active ? "rotate-45 text-ember" : "text-muted-foreground",
                )}
                aria-hidden
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {active && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-8 pb-10 md:grid-cols-12">
                    <p className="text-lg leading-relaxed text-muted-foreground md:col-span-5 md:col-start-2">{s.summary[locale]}</p>
                    <ul className="space-y-2 md:col-span-4 md:col-start-8">
                      {s.features[locale].map((f) => (
                        <li key={f} className="flex gap-3 text-sm">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 md:col-span-11 md:col-start-2">
                      {s.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
