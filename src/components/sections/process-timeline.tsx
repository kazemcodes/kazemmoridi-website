import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { toFaDigits, useLocale } from "@/i18n/locale";
import { processSteps } from "@/content/process";
import { Tag } from "@/components/primitives/layout";

/** Vertical timeline with a scroll-linked progress line. */
export function ProcessTimeline({ compact }: { compact?: boolean }) {
  const locale = useLocale();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative">
      <span className="absolute inset-y-0 start-[11px] w-px bg-line md:start-[calc(25%-1px)]" aria-hidden />
      <motion.span
        style={{ scaleY }}
        className="absolute inset-y-0 start-[11px] w-px origin-top bg-ember md:start-[calc(25%-1px)]"
        aria-hidden
      />
      {processSteps.map((step, i) => {
        const n = String(i + 1).padStart(2, "0");
        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8 }}
            className="relative grid gap-4 pb-16 ps-10 md:grid-cols-4 md:ps-0"
          >
            <span className="absolute start-1.5 top-2 h-3 w-3 rounded-full border-2 border-ember bg-background md:start-[calc(25%-6px)]" />
            <span className="text-5xl font-semibold text-muted-foreground/50 md:pe-12 md:text-end">
              {locale === "fa" ? toFaDigits(n) : n}
            </span>
            <div className="md:col-span-3 md:ps-14">
              <h3 className="text-2xl font-medium md:text-4xl">{step.title[locale]}</h3>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{step.body[locale]}</p>
              {!compact && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {step.deliverables[locale].map((x) => (
                    <Tag key={x}>{x}</Tag>
                  ))}
                </div>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
