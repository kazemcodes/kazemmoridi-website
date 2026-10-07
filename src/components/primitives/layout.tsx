import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 md:px-10", className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-bold text-ember", className)}>
      <span className="h-1.5 w-6 rounded-full bg-ember" aria-hidden />
      {children}
    </span>
  );
}

/** Rounded gray pill label, optionally with a pulsing brand dot. */
export function Chip({ children, pulse, className }: { children: ReactNode; pulse?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex w-fit items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold text-muted-foreground", className)}>
      <span className={cn("h-2 w-2 rounded-full bg-ember", pulse && "animate-pulse")} aria-hidden />
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
export function Section({ index: _index, eyebrow, title, aside, className, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-20 md:py-28", className)} {...props}>
      <Container>
        {(eyebrow || title) && (
          <header className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
            <div className="flex flex-col gap-4">
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              {title && (
                <Reveal>
                  <h2 className="max-w-3xl text-3xl font-bold leading-snug md:text-5xl">{title}</h2>
                </Reveal>
              )}
            </div>
            {aside && <div>{aside}</div>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}

export function PageHero({ eyebrow, title, lede }: { eyebrow: ReactNode; title: ReactNode; lede?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface pb-16 pt-36 md:pb-20 md:pt-44">
      <div className="pointer-events-none absolute -top-32 end-0 h-[420px] w-[420px] rounded-full bg-ember-soft blur-3xl" aria-hidden />
      <Container className="relative">
        <Chip>{eyebrow}</Chip>
        <Reveal>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-snug md:text-6xl">{title}</h1>
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
    <span className="inline-flex items-center rounded-lg bg-surface px-3 py-1 text-xs text-muted-foreground">
      {children}
    </span>
  );
}
