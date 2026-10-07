import { AnimatePresence, motion } from "motion/react";
import { Code2, LayoutTemplate, ShoppingBag, Smartphone, Check, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { dictionary as d } from "@/i18n/dictionary";
import { formatNumber, useLocale } from "@/i18n/locale";
import { addOns, estimate, projectTypes } from "@/content/pricing";
import { StudioButton } from "@/components/primitives/button";
import { LocaleLink } from "@/components/site/locale-link";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, LucideIcon> = { store: ShoppingBag, platform: Code2, corporate: LayoutTemplate, app: Smartphone };

/** Toggle switch styled like a mobile settings row. */
function Switch({ on }: { on: boolean }) {
  return (
    <span className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", on ? "bg-ember" : "bg-surface-2")}>
      <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-card shadow transition-all duration-300", on ? "start-6" : "start-1")} />
    </span>
  );
}

/** Product configurator with a live, receipt-style quote (پیش‌فاکتور). */
export function PricingCalculator() {
  const locale = useLocale();
  const [type, setType] = useState(projectTypes[0]?.id ?? "store");
  const [chosen, setChosen] = useState<string[]>(addOns.filter((a) => a.recommended).map((a) => a.id));
  const result = useMemo(() => estimate(type, chosen), [type, chosen]);
  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const n = (v: number) => formatNumber(v, locale);
  const current = projectTypes.find((t) => t.id === type) ?? projectTypes[0]!;
  const lines = addOns.filter((a) => chosen.includes(a.id));

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-7">
        <fieldset>
          <legend className="mb-5 text-sm font-bold">{d.pricing.type[locale]}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {projectTypes.map((t) => {
              const on = type === t.id;
              const Icon = TYPE_ICONS[t.id] ?? Code2;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  aria-pressed={on}
                  className={cn(
                    "relative flex items-start gap-4 rounded-2xl border-2 p-5 text-start transition-all duration-200",
                    on ? "border-ember bg-ember-soft" : "border-line bg-card hover:-translate-y-0.5 hover:border-ember/30",
                  )}
                >
                  <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl", on ? "bg-ember text-primary-foreground" : "bg-surface text-ember")}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-lg font-bold">{t.title[locale]}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{t.desc[locale]}</span>
                  </span>
                  {on && (
                    <span className="absolute end-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-ember text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-5 text-sm font-bold">{d.pricing.features[locale]}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {addOns.map((a) => {
              const on = chosen.includes(a.id);
              return (
                <label
                  key={a.id}
                  className={cn("flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors", on ? "border-ember/30 bg-card" : "border-line bg-surface")}
                >
                  <input type="checkbox" checked={on} onChange={() => toggle(a.id)} className="peer sr-only" />
                  <span className="flex-1">
                    <span className="block text-sm font-bold">{a.title[locale]}</span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      +{n(a.price)} {d.pricing.currency[locale]}
                      {a.recommended && <span className="rounded-md bg-cyan-soft px-1.5 py-0.5 text-cyan">{d.pricing.recommended[locale]}</span>}
                    </span>
                  </span>
                  <Switch on={on} />
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <aside className="lg:col-span-5">
        <div className="sticky top-28">
          <div className="relative rounded-t-3xl bg-card p-8 shadow-soft">
            <div className="flex items-center justify-between border-b-2 border-dashed border-line pb-5">
              <span className="text-xl font-bold">{d.pricing.receipt[locale]}</span>
              <span className="text-xs text-muted-foreground">KM-{n(1405)}</span>
            </div>

            <ul className="space-y-3 py-5 text-sm">
              <li className="flex justify-between gap-4 font-bold">
                <span>{d.pricing.base[locale]} · {current.title[locale]}</span>
                <span>{n(current.basePrice)}</span>
              </li>
              <AnimatePresence initial={false}>
                {lines.map((a) => (
                  <motion.li
                    key={a.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-between gap-4 overflow-hidden text-muted-foreground"
                  >
                    <span>{a.title[locale]}</span>
                    <span>+{n(a.price)}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="border-t-2 border-dashed border-line pt-5">
              <div className="text-xs text-muted-foreground">{d.pricing.total[locale]}</div>
              <motion.div key={`${result.price.min}-${result.price.max}`} initial={{ scale: 0.96, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-2 text-4xl font-bold text-ember">
                {n(result.price.min)} – {n(result.price.max)}
              </motion.div>
              <div className="mt-1 text-sm text-muted-foreground">{d.pricing.currency[locale]}</div>
              <div className="mt-5 flex items-center gap-3 rounded-xl bg-surface px-4 py-3 text-sm">
                <span className="text-2xl font-bold">~{n(result.days)}</span>
                <span className="text-muted-foreground">{d.pricing.days[locale]}</span>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{d.pricing.note[locale]}</p>
              <StudioButton asChild className="mt-6 w-full">
                <LocaleLink to="/{-$lang}/contact">{d.cta.start[locale]}</LocaleLink>
              </StudioButton>
            </div>
          </div>
          {/* Torn receipt edge */}
          <div
            className="h-4 w-full bg-card"
            style={{ maskImage: "radial-gradient(circle at 10px 0, transparent 9px, #000 10px)", maskSize: "20px 16px", WebkitMaskImage: "radial-gradient(circle at 10px 0, transparent 9px, #000 10px)", WebkitMaskSize: "20px 16px" }}
            aria-hidden
          />
        </div>
      </aside>
    </div>
  );
}
