import { motion } from "motion/react";
import { useRef } from "react";
import { useLocale } from "@/i18n/locale";
import { statusLabels, type Project } from "@/content/projects";
import { LocaleLink } from "@/components/site/locale-link";
import { cn } from "@/lib/utils";

/** Browser-window mockup tinted per project — data-driven hue, no stock imagery. */
export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const tint = (l: number, c: number, a = 1) => `oklch(${l} ${c} ${project.hue} / ${a})`;
  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-6 md:p-8", className)} style={{ background: tint(0.96, 0.03) }}>
      <div dir="ltr" className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-card shadow-soft transition-transform duration-500 group-hover:-translate-y-2">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ember/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-5" />
          <span className="ms-3 flex-1 truncate rounded-md bg-surface px-3 py-1 text-[11px] text-muted-foreground">{project.displayUrl}</span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="h-16 rounded-lg" style={{ background: `linear-gradient(135deg, ${tint(0.62, 0.16)}, ${tint(0.75, 0.12)})` }} />
          <div className="grid flex-1 grid-cols-3 gap-3">
            {[0.9, 0.93, 0.88].map((l, i) => (
              <div key={i} className="rounded-lg" style={{ background: tint(l, 0.04) }} />
            ))}
          </div>
          <div className="h-2 w-2/3 rounded-full bg-surface-2" />
          <div className="h-2 w-1/2 rounded-full bg-surface-2" />
        </div>
      </div>
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
      <LocaleLink to="/{-$lang}/work/$slug" slug={project.slug} className="group block rounded-3xl border border-line bg-card p-3 transition-shadow duration-300 hover:shadow-soft">
        <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className="transition-transform duration-300 ease-out">
          <ProjectCover project={project} className={"aspect-[16/11]"} />
        </div>
        <div className="flex items-start justify-between gap-6 px-3 pb-3 pt-5">
          <div>
            <h3 className="text-xl font-bold transition-colors group-hover:text-ember md:text-2xl">{project.title[locale]}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{project.discipline[locale]}</p>
          </div>
          <span className="shrink-0 rounded-lg bg-surface px-2 py-1 text-xs text-muted-foreground">
            {statusLabels[project.status][locale]} · {project.year}
          </span>
        </div>
      </LocaleLink>
    </motion.article>
  );
}

export function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((p, i) => (
        <div key={p.slug}>
          <ProjectCard project={p} large={i === 0} />
        </div>
      ))}
    </div>
  );
}
