import { cn } from "@/lib/utils";

/** Floating white card with an icon, a big figure and a caption. */
export function StatBadge({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 rounded-3xl border border-line bg-card p-5 shadow-soft", className)}>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-cyan-soft text-cyan">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      </span>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
