import { createFileRoute, notFound } from "@tanstack/react-router";
import { dictionary as d } from "@/i18n/dictionary";
import { toLocale, useLocale } from "@/i18n/locale";
import { getProject, projects, statusLabels } from "@/content/projects";
import { Container, Eyebrow, Tag } from "@/components/primitives/layout";
import { StudioButton } from "@/components/primitives/button";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard, ProjectCover } from "@/components/sections/project-card";
import { CtaBand } from "@/components/sections/cta-band";

export const Route = createFileRoute("/{-$lang}/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Not found — KM Studio" }, { name: "robots", content: "noindex" }] };
    const l = toLocale(params.lang);
    const t = `${loaderData.project.title[l]} — KM Studio`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.project.tagline[l] },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.project.tagline[l] },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <Container className="py-48 text-center text-4xl">404</Container>
  ),
  component: ProjectPage,
});

function ProjectPage() {
  const { project: p } = Route.useLoaderData();
  const locale = useLocale();
  const next = projects[(projects.findIndex((x) => x.slug === p.slug) + 1) % projects.length] ?? p;

  return (
    <>
      <section className="pb-16 pt-40 md:pt-52">
        <Container>
          <Eyebrow>{p.discipline[locale]} · {p.year}</Eyebrow>
          <Reveal>
            <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-snug md:text-8xl">{p.title[locale]}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">{p.tagline[locale]}</p>
          </Reveal>
        </Container>
      </section>

      <Container>
        <Reveal>
          <ProjectCover project={p} className="aspect-[16/9]" />
        </Reveal>

        <div className="grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <dl className="space-y-6 md:col-span-4">
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Status</dt>
              <dd className="mt-2">{statusLabels[p.status][locale]}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Stack</dt>
              <dd className="mt-3 flex flex-wrap gap-2">{p.stack.map((s) => <Tag key={s}>{s}</Tag>)}</dd>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <StudioButton asChild size="sm">
                <a href={p.url} target="_blank" rel="noreferrer">{p.githubUrl ? d.cta.source[locale] : d.cta.visit[locale]} ↗</a>
              </StudioButton>
            </div>
          </dl>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-xl leading-relaxed md:text-2xl">{p.description[locale]}</p>
            <ul className="mt-12 divide-y divide-line border-y border-line">
              {p.highlights[locale].map((h) => (
                <li key={h} className="flex gap-4 py-5">
                  <span className="text-ember">✦</span>
                  {h}
                </li>
              ))}
            </ul>
            {p.stats && (
              <div className="mt-12 grid grid-cols-3 gap-6">
                {p.stats[locale].map((s) => (
                  <div key={s.label}>
                    <div className="text-4xl text-ember">{s.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-line py-20">
          <Eyebrow>{locale === "fa" ? "پروژه بعدی" : "Next project"}</Eyebrow>
          <div className="mt-10 max-w-3xl">
            <ProjectCard project={next} />
          </div>
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
