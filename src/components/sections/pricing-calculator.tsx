import { useMemo, useState } from "react";
import { dictionary as d } from "@/i18n/dictionary";
import { formatNumber, useLocale } from "@/i18n/locale";
import { addOns, estimate, projectTypes } from "@/content/pricing";
import { StudioButton } from "@/components/primitives/button";
import { LocaleLink } from "@/components/site/locale-link";
import { cn } from "@/lib/utils";

export function PricingCalculator() {
  const locale = useLocale();
  const [type, setType] = useState(projectTypes[0]?.id ?? "store");
  const [chosen, setChosen] = useState<string[]>(addOns.filter((a) => a.recommended).map((a) => a.id));
  const result = useMemo(() => estimate(type, chosen), [type, chosen]);
  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const n = (v: number) => formatNumber(v, locale);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-8">
        <fieldset>
          <legend className="mb-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">{d.pricing.type[locale]}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {projectTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                aria-pressed={type === t.id}
                className={cn(
                  "rounded-[var(--radius)] border p-6 text-start transition-colors",
                  type === t.id ? "border-ember bg-ember-soft" : "border-line hover:border-foreground/30",
                )}
              >
                <div className="font-display text-xl">{t.title[locale]}</div>
                <div className="mt-2 text-sm text-muted-foreground">{t.desc[locale]}</div>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">{d.pricing.features[locale]}</legend>
          <div className="divide-y divide-line border-y border-line">
            {addOns.map((a) => {
              const on = chosen.includes(a.id);
              return (
                <label key={a.id} className="flex cursor-pointer items-center gap-4 py-4">
                  <input type="checkbox" checked={on} onChange={() => toggle(a.id)} className="peer sr-only" />
                  <span className={cn("grid h-5 w-5 place-items-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring", on ? "border-ember bg-ember" : "border-line")}>
                    {on && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                  </span>
                  <span className="flex-1">{a.title[locale]}</span>
                  {a.recommended && <span className="font-mono text-[11px] text-ember">{d.pricing.recommended[locale]}</span>}
                  <span className="w-20 text-end font-mono text-sm text-muted-foreground">+{n(a.price)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-28 rounded-[calc(var(--radius)+8px)] border border-line bg-surface p-8">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{d.pricing.estimate[locale]}</div>
          <div className="mt-6 font-display text-5xl font-semibold text-ember">
            {n(result.price.min)}–{n(result.price.max)}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">{d.pricing.currency[locale]}</div>
          <div className="mt-8 border-t border-line pt-6 font-display text-3xl">
            ~{n(result.days)} <span className="text-base text-muted-foreground">{d.pricing.days[locale]}</span>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{d.pricing.note[locale]}</p>
          <StudioButton asChild className="mt-8 w-full">
            <LocaleLink to="/{-$lang}/contact">{d.cta.start[locale]}</LocaleLink>
          </StudioButton>
        </div>
      </aside>
    </div>
  );
}
