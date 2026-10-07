import { motion } from "motion/react";
import { useRef } from "react";
import { useLocale } from "@/i18n/locale";
import { dictionary as d } from "@/i18n/dictionary";
import { statusLabels, type Project } from "@/content/projects";
import { LocaleLink } from "@/components/site/locale-link";
import { cn } from "@/lib/utils";

/** Generative cover art per project — data-driven hue, no stock imagery. */
export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const initial = project.title.en.charAt(0);
  return (
    <div
      className={cn("grain relative overflow-hidden rounded-[var(--radius)] bg-surface", className)}
      style={{
        backgroundImage: `radial-gradient(80% 90% at 75% 20%, oklch(0.62 0.16 ${project.hue} / 0.85), transparent 60%), radial-gradient(60% 60% at 10% 100%, oklch(0.4 0.1 ${project.hue + 40} / 0.7), transparent 70%)`,
      }}
    >
      <span
        dir="ltr"
        className="absolute -bottom-[0.18em] end-4 select-none font-display text-[16rem] font-bold leading-none text-bone/10 transition-transform duration-700 group-hover:-translate-y-4"
        aria-hidden
      >
        {initial}
      </span>
      <span dir="ltr" className="absolute start-5 top-5 rounded-full bg-background/60 px-3 py-1 font-mono text-[11px] backdrop-blur">
        {project.displayUrl}
      </span>
    </div>
  );
}

export function ProjectCard({ project, large }: { project: Project; large?: boolean }) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <LocaleLink to="/{-$lang}/work/$slug" slug={project.slug} className="group block" data-cursor={d.cta.viewWork.en}>
        <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className="transition-transform duration-300 ease-out">
          <ProjectCover project={project} className={large ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[4/3]"} />
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-medium transition-colors group-hover:text-ember md:text-2xl">{project.title[locale]}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{project.discipline[locale]}</p>
          </div>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {statusLabels[project.status][locale]} · {project.year}
          </span>
        </div>
      </LocaleLink>
    </motion.article>
  );
}

export function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((p, i) => (
        <div key={p.slug} className={cn(i % 2 === 1 && "md:mt-32")}>
          <ProjectCard project={p} large={i === 0} />
        </div>
      ))}
    </div>
  );
}
