import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Client } from "@/domain/types";
import { newId } from "@/domain/invoice";
import { useRepo } from "@/features/admin/queries";
import { DataTable, EmptyState, PageTitle, Panel, TextArea, TextField } from "@/components/admin/fields";
import { StudioButton } from "@/components/primitives/button";

export const Route = createFileRoute("/admin/clients")({ component: ClientsPage });

const blank = (): Client => ({ id: newId(), name: "" });

const FIELDS: { key: keyof Client; label: string; ltr?: boolean }[] = [
  { key: "name", label: "نام" },
  { key: "company", label: "شرکت / سازمان" },
  { key: "phone", label: "تلفن", ltr: true },
  { key: "email", label: "ایمیل", ltr: true },
  { key: "nationalId", label: "شناسه ملی", ltr: true },
  { key: "economicCode", label: "کد اقتصادی", ltr: true },
  { key: "postalCode", label: "کد پستی", ltr: true },
];

function ClientsPage() {
  const repo = useRepo<Client>("clients");
  const list = repo.useList();
  const [editing, setEditing] = useState<Client | null>(null);

  const set = (k: keyof Client, v: string) => setEditing((c) => (c ? { ...c, [k]: v } : c));

  return (
    <>
      <PageTitle title="مشتریان" actions={<StudioButton size="sm" onClick={() => setEditing(blank())}>مشتری جدید</StudioButton>} />
      {editing && (
        <Panel title={editing.name || "مشتری جدید"} className="mb-6">
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              repo.save.mutate(editing, { onSuccess: () => setEditing(null) });
            }}
          >
            {FIELDS.map((f) => (
              <TextField
                key={f.key}
                label={f.label}
                dir={f.ltr ? "ltr" : undefined}
                required={f.key === "name"}
                value={(editing[f.key] as string) ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              />
            ))}
            <TextArea className="md:col-span-2" label="آدرس" value={editing.address ?? ""} onChange={(e) => set("address", e.target.value)} />
            <div className="flex gap-2 md:col-span-2">
              <StudioButton type="submit" size="sm" disabled={repo.save.isPending}>ذخیره</StudioButton>
              <StudioButton type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}>انصراف</StudioButton>
            </div>
          </form>
        </Panel>
      )}
      {list.data?.length ? (
        <DataTable
          rows={list.data}
          onRowClick={(c) => setEditing(c)}
          columns={[
            { header: "نام", cell: (c) => c.name },
            { header: "شرکت", cell: (c) => c.company ?? "—" },
            { header: "تلفن", cell: (c) => <span dir="ltr">{c.phone ?? "—"}</span> },
            {
              header: "",
              className: "text-end",
              cell: (c) => (
                <button
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("حذف شود؟")) repo.remove.mutate(c.id);
                  }}
                >
                  حذف
                </button>
              ),
            },
          ]}
        />
      ) : (
        <EmptyState>{list.isLoading ? "در حال بارگذاری…" : "مشتری‌ای ثبت نشده."}</EmptyState>
      )}
    </>
  );
}
