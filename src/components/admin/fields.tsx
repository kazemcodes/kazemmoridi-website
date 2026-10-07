import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ember";

export function TextField({ label, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <input className={base} {...props} />
    </label>
  );
}

export function TextArea({ label, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <textarea className={cn(base, "min-h-28")} {...props} />
    </label>
  );
}

export function SelectField<V extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: V;
  onChange: (v: V) => void;
  options: { value: V; label: string }[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select className={base} value={value} onChange={(e) => onChange(e.target.value as V)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Panel({ title, actions, children, className }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface p-5 md:p-6", className)}>
      {(title || actions) && (
        <header className="mb-5 flex items-center justify-between gap-4">
          {title && <h2 className="text-lg">{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {actions}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted-foreground">{children}</div>;
}

export function DataTable<T>({
  rows,
  columns,
  onRowClick,
}: {
  rows: T[];
  columns: { header: string; cell: (row: T) => ReactNode; className?: string }[];
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface text-xs text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c.header} className={cn("px-4 py-3 text-start font-normal", c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i} onClick={() => onRowClick?.(r)} className={cn(onRowClick && "cursor-pointer hover:bg-surface")}>
              {columns.map((c) => (
                <td key={c.header} className={cn("px-4 py-3", c.className)}>
                  {c.cell(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
