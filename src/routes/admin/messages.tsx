import { createFileRoute } from "@tanstack/react-router";
import { useMessages } from "@/features/admin/queries";
import { EmptyState, PageTitle } from "@/components/admin/fields";
import { StudioButton } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/messages")({ component: MessagesPage });

function MessagesPage() {
  const { query, markRead, remove } = useMessages();
  const list = query.data ?? [];
  return (
    <>
      <PageTitle title="پیام‌های فرم تماس" />
      {!list.length && <EmptyState>{query.isLoading ? "در حال بارگذاری…" : "پیامی دریافت نشده."}</EmptyState>}
      <div className="space-y-3">
        {list.map((m) => (
          <article key={m.id} className={cn("rounded-2xl border bg-surface p-5", m.read ? "border-line" : "border-ember")}>
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-medium">{m.name}</span>
                <span className="ms-3 text-sm text-muted-foreground" dir="ltr">{m.contact}</span>
              </div>
              <span className="text-xs text-muted-foreground" dir="ltr">
                {new Date(m.createdAt).toLocaleString("fa-IR")} · {m.locale}
              </span>
            </header>
            {m.budget && <p className="mt-2 text-xs text-ember">بودجه: {m.budget}</p>}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
            <div className="mt-4 flex gap-2">
              <StudioButton size="sm" variant="line" onClick={() => markRead.mutate({ id: m.id, read: !m.read })}>
                {m.read ? "علامت خوانده‌نشده" : "خوانده شد"}
              </StudioButton>
              <StudioButton size="sm" variant="ghost" onClick={() => confirm("حذف شود؟") && remove.mutate(m.id)}>
                حذف
              </StudioButton>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
