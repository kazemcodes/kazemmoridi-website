import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { dictionary as d } from "@/i18n/dictionary";
import { toFaDigits, useLocale } from "@/i18n/locale";
import { processSteps } from "@/content/process";
import { Tag } from "@/components/primitives/layout";
import { cn } from "@/lib/utils";

/**
 * Metro-line stepper: stations on a track that fills up to the chosen step,
 * with the step's details in a card underneath.
 */
export function ProcessTimeline({ compact }: { compact?: boolean }) {
  const locale = useLocale();
  const [active, setActive] = useState(0);
  const total = processSteps.length;
  const step = processSteps[active] ?? processSteps[0]!;
  const n = (v: number) => (locale === "fa" ? toFaDigits(String(v)) : String(v));
  const progress = total > 1 ? active / (total - 1) : 1;

  return (
    <div>
      <div className="relative overflow-x-auto pb-4">
        <div className="relative mx-6 min-w-[640px]">
          <div className="absolute inset-x-0 top-6 h-2 rounded-full bg-surface-2" aria-hidden />
          <motion.div
            className="absolute top-6 h-2 rounded-full bg-ember ltr:left-0 rtl:right-0"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
          />
          <ol className="relative flex justify-between">
            {processSteps.map((s, i) => {
              const done = i <= active;
              return (
                <li key={i} className="flex w-28 flex-col items-center text-center first:-ms-6 last:-me-6">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={i === active ? "step" : undefined}
                    className={cn(
                      "grid h-14 w-14 place-items-center rounded-full border-4 text-lg font-bold transition-all duration-300",
                      done ? "border-background bg-ember text-primary-foreground shadow-ember" : "border-background bg-surface-2 text-muted-foreground hover:bg-line",
                      i === active && "scale-110",
                    )}
                  >
                    {n(i + 1)}
                  </button>
                  <span className={cn("mt-3 text-sm transition-colors", i === active ? "font-bold text-foreground" : "text-muted-foreground")}>
                    {s.title[locale]}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="mt-10 grid gap-8 rounded-3xl border border-line bg-card p-8 shadow-soft md:grid-cols-12 md:p-12"
        >
          <div className="md:col-span-8">
            <span className="rounded-lg bg-ember-soft px-3 py-1 text-xs font-bold text-ember">
              {d.process.step[locale]} {n(active + 1)} {d.process.of[locale]} {n(total)}
            </span>
            <h3 className="mt-5 text-3xl font-bold md:text-4xl">{step.title[locale]}</h3>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{step.body[locale]}</p>
            {!compact && (
              <div className="mt-6 flex flex-wrap gap-2">
                {step.deliverables[locale].map((x) => <Tag key={x}>{x}</Tag>)}
              </div>
            )}
          </div>
          <div className="flex items-end md:col-span-4 md:justify-end">
            {active < total - 1 && (
              <button
                type="button"
                onClick={() => setActive((a) => a + 1)}
                className="group inline-flex items-center gap-3 rounded-2xl bg-surface px-6 py-4 font-bold transition-colors hover:bg-ember hover:text-primary-foreground"
              >
                {d.process.next[locale]}
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
