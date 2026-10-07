import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toFaDigits, useLocale } from "@/i18n/locale";
import { testimonials } from "@/content/testimonials";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const locale = useLocale();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 8000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[i] ?? testimonials[0]!;
  const fmt = (n: number) => (locale === "fa" ? toFaDigits(String(n).padStart(2, "0")) : String(n).padStart(2, "0"));

  return (
    <div className="grid gap-10 md:grid-cols-12">
      <div className="min-h-[18rem] md:col-span-9">
        <AnimatePresence mode="wait">
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <blockquote className="font-display text-2xl leading-snug md:text-4xl">
              <span className="text-ember">“</span>
              {t.quote[locale]}
              <span className="text-ember">”</span>
            </blockquote>
            <figcaption className="mt-8 text-sm">
              <span className="text-foreground">{t.author[locale]}</span>
              <span className="mx-2 text-muted-foreground">—</span>
              <span dir="ltr" className="font-mono text-muted-foreground">{t.company[locale]}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="flex items-end gap-3 md:col-span-3 md:flex-col md:items-end">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Testimonial ${idx + 1}`}
            className={cn("font-mono text-sm transition-colors", idx === i ? "text-ember" : "text-muted-foreground hover:text-foreground")}
          >
            {fmt(idx + 1)}
          </button>
        ))}
      </div>
    </div>
  );
}
