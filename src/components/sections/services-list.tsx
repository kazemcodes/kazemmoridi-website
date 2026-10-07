import { AnimatePresence, motion } from "motion/react";
import { Code2, Gauge, LayoutTemplate, ShieldCheck, ShoppingBag, Smartphone, Check, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale, toFaDigits } from "@/i18n/locale";
import type { Service } from "@/content/services";
import { Tag } from "@/components/primitives/layout";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  ecommerce: ShoppingBag,
  platforms: Code2,
  design: LayoutTemplate,
  performance: Gauge,
  apps: Smartphone,
  devops: ShieldCheck,
};
const CYCLE_MS = 7000;

/**
 * Service explorer: a rail of service "tickets" that auto-advance like stories,
 * next to a large detail panel. Hovering or clicking pins a service.
 */
export function ServicesList({ services, defaultOpen = 0 }: { services: Service[]; defaultOpen?: number }) {
  const locale = useLocale();
  const [active, setActive] = useState(defaultOpen);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % services.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, paused, services.length]);

  const s = services[active] ?? services[0]!;
  const Icon = ICONS[s.id] ?? Code2;
  const num = (i: number) => (locale === "fa" ? toFaDigits(String(i + 1).padStart(2, "0")) : String(i + 1).padStart(2, "0"));

  return (
    <div className="grid gap-6 lg:grid-cols-12" onMouseLeave={() => setPaused(false)}>
      <ul className="flex gap-3 overflow-x-auto pb-2 lg:col-span-5 lg:flex-col lg:overflow-visible lg:pb-0" role="tablist">
        {services.map((svc, i) => {
          const on = i === active;
          const RowIcon = ICONS[svc.id] ?? Code2;
          return (
            <li key={svc.id} className="shrink-0 lg:shrink">
              <button
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => { setActive(i); setPaused(true); }}
                onMouseEnter={() => { setActive(i); setPaused(true); }}
                className={cn(
                  "relative flex w-64 items-center gap-4 overflow-hidden rounded-2xl border p-4 text-start transition-all duration-300 lg:w-full",
                  on ? "border-transparent bg-foreground text-background shadow-soft" : "border-line bg-card hover:border-ember/30",
                )}
              >
                <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors", on ? "bg-ember text-primary-foreground" : "bg-surface text-ember")}>
                  <RowIcon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className={cn("block text-xs", on ? "text-background/60" : "text-muted-foreground")}>{num(i)}</span>
                  <span className="block text-lg font-bold">{svc.title[locale]}</span>
                </span>
                {on && !paused && (
                  <motion.span
                    key={`p-${active}`}
                    className="absolute inset-x-0 bottom-0 h-1 origin-[inherit] bg-ember ltr:origin-left rtl:origin-right"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="relative min-h-[26rem] overflow-hidden rounded-3xl bg-surface p-8 md:p-12 lg:col-span-7" role="tabpanel">
        <span className="pointer-events-none absolute -bottom-10 end-6 select-none text-[12rem] font-bold leading-none text-foreground/[0.04]" aria-hidden>
          {num(active)}
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-card text-ember shadow-soft">
              <Icon className="h-7 w-7" />
            </span>
            <h3 className="mt-8 text-3xl font-bold md:text-4xl">{s.title[locale]}</h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{s.summary[locale]}</p>
            <p className="mt-8 text-sm font-bold text-foreground">{d.services.included[locale]}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {s.features[locale].map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: locale === "fa" ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-sm"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-soft text-cyan">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {f}
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              {s.tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
