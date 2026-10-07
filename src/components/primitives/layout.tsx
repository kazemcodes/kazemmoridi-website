import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 md:px-10", className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground rtl:font-sans rtl:tracking-normal", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
      {children}
    </span>
  );
}

interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  index?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  aside?: ReactNode;
}

/** Page section with an optional numbered editorial header. */
export function Section({ index, eyebrow, title, aside, className, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-24 md:py-36", className)} {...props}>
      <Container>
        {(eyebrow || title) && (
          <header className="mb-14 grid gap-6 border-t border-line pt-6 md:mb-20 md:grid-cols-12">
            <div className="flex items-center gap-4 md:col-span-3">
              {index && <span className="font-mono text-xs text-ember">{index}</span>}
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            </div>
            {title && (
              <Reveal className="md:col-span-7">
                <h2 className="font-display text-4xl font-semibold leading-[1.05] md:text-6xl">{title}</h2>
              </Reveal>
            )}
            {aside && <div className="md:col-span-2 md:justify-self-end">{aside}</div>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}

export function PageHero({ eyebrow, title, lede }: { eyebrow: ReactNode; title: ReactNode; lede?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
      <div className="ember-glow pointer-events-none absolute -top-40 start-1/2 h-[600px] w-[900px] -translate-x-1/2 opacity-60 rtl:translate-x-1/2" aria-hidden />
      <Container className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Reveal>
          <h1 className="mt-8 max-w-5xl font-display text-5xl font-semibold leading-[1.02] md:text-8xl">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{lede}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted-foreground">
      {children}
    </span>
  );
}
