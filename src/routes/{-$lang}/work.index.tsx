import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { dictionary as d } from "@/i18n/dictionary";
import { useLocale } from "@/i18n/locale";
import { pageHead } from "@/lib/seo";
import { categoryLabels, projects, type ProjectCategory } from "@/content/projects";
import { PageHero, Section } from "@/components/primitives/layout";
import { WorkGrid } from "@/components/sections/project-card";
import { CtaBand } from "@/components/sections/cta-band";
import { cn } from "@/lib/utils";

const lede = {
  fa: "سامانه‌ها، فروشگاه‌ها و ابزارهایی که هر روز استفاده می‌شوند.",
  en: "Platforms, stores and tools people use every day.",
};

export const Route = createFileRoute("/{-$lang}/work/")({
  head: ({ params }) => pageHead(params.lang, { fa: "نمونه‌کارها", en: "Work" }, lede),
  component: WorkPage,
});

function WorkPage() {
  const locale = useLocale();
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const filters: (ProjectCategory | "all")[] = ["all", "websites", "apps", "tools"];

  return (
    <>
      <PageHero eyebrow={d.nav.work[locale]} title={d.sections.work[locale]} lede={lede[locale]} />
      <Section className="pt-0 md:pt-0">
        <div className="mb-14 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "rounded-full border px-5 py-2 text-sm transition-colors",
                filter === f ? "border-ember bg-ember text-primary-foreground" : "border-line text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "all" ? (locale === "fa" ? "همه" : "All") : categoryLabels[f][locale]}
            </button>
          ))}
        </div>
        <WorkGrid projects={list} />
      </Section>
      <CtaBand />
    </>
  );
}
