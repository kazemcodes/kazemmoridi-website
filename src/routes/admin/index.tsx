import { createFileRoute, Link } from "@tanstack/react-router";
import type { Client, Invoice, OfficialLetter } from "@/domain/types";
import { useMessages, useRepo } from "@/features/admin/queries";
import { invoiceStatus } from "@/features/admin/labels";
import { formatToman, toFa } from "@/lib/persian";
import { DataTable, EmptyState, PageTitle, Panel } from "@/components/admin/fields";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-3 font-display text-3xl text-ember">{value}</div>
    </div>
  );
}

function Dashboard() {
  const invoices = useRepo<Invoice>("invoices").useList();
  const clients = useRepo<Client>("clients").useList();
  const letters = useRepo<OfficialLetter>("letters").useList();
  const messages = useMessages().query;

  const inv = invoices.data ?? [];
  const paid = inv.filter((i) => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0);
  const pending = inv.filter((i) => i.status === "pending").reduce((s, i) => s + i.totalAmount, 0);
  const unread = (messages.data ?? []).filter((m) => !m.read).length;

  return (
    <>
      <PageTitle title="داشبورد" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="درآمد وصول‌شده (ریال)" value={formatToman(paid)} />
        <Stat label="در انتظار پرداخت (ریال)" value={formatToman(pending)} />
        <Stat label="مشتریان" value={toFa(clients.data?.length ?? 0)} />
        <Stat label="پیام خوانده‌نشده" value={toFa(unread)} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="آخرین فاکتورها" actions={<Link to="/admin/invoices" className="text-xs text-ember">همه</Link>}>
          {inv.length ? (
            <DataTable
              rows={inv.slice(0, 5)}
              columns={[
                { header: "شماره", cell: (r) => r.invoiceNumber },
                { header: "خریدار", cell: (r) => r.buyerName },
                { header: "مبلغ", cell: (r) => formatToman(r.totalAmount) },
                { header: "وضعیت", cell: (r) => invoiceStatus[r.status] },
              ]}
            />
          ) : (
            <EmptyState>هنوز فاکتوری ثبت نشده.</EmptyState>
          )}
        </Panel>
        <Panel title="آخرین پیام‌ها" actions={<Link to="/admin/messages" className="text-xs text-ember">همه</Link>}>
          {(messages.data ?? []).length ? (
            <ul className="divide-y divide-line">
              {messages.data!.slice(0, 5).map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex justify-between text-sm">
                    <span>{m.name}</span>
                    {!m.read && <span className="text-xs text-ember">جدید</span>}
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{m.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>پیامی نیست.</EmptyState>
          )}
        </Panel>
        <Panel title="نامه‌ها">
          <p className="text-sm text-muted-foreground">{toFa(letters.data?.length ?? 0)} نامه ثبت‌شده</p>
        </Panel>
      </div>
    </>
  );
}
