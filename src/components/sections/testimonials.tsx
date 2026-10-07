import { motion } from "motion/react";
import { CheckCheck } from "lucide-react";
import { useLocale } from "@/i18n/locale";
import { testimonials } from "@/content/testimonials";
import { cn } from "@/lib/utils";

/** Client feedback as a messenger thread — the way Iranian clients actually talk to studios. */
export function Testimonials() {
  const locale = useLocale();
  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-surface p-4 md:p-8">
      <div className="space-y-6">
        {testimonials.map((t, i) => {
          const mine = i % 2 === 1;
          const initial = t.author[locale].trim().charAt(0);
          return (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className={cn("flex items-end gap-3", mine && "flex-row-reverse")}
            >
              <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg font-bold", mine ? "bg-cyan text-primary-foreground" : "bg-ember text-primary-foreground")}>
                {initial}
              </span>
              <div
                className={cn(
                  "max-w-[85%] rounded-3xl px-6 py-5 shadow-soft",
                  mine ? "rounded-ee-md bg-foreground text-background" : "rounded-es-md bg-card",
                )}
              >
                <blockquote className="text-lg leading-relaxed">{t.quote[locale]}</blockquote>
                <figcaption className={cn("mt-3 flex items-center justify-between gap-4 text-xs", mine ? "text-background/60" : "text-muted-foreground")}>
                  <span>
                    <span className="font-bold">{t.author[locale]}</span> · <span dir="ltr">{t.company[locale]}</span>
                  </span>
                  <CheckCheck className="h-4 w-4 text-cyan" aria-hidden />
                </figcaption>
              </div>
            </motion.figure>
          );
        })}
      </div>
    </div>
  );
}
