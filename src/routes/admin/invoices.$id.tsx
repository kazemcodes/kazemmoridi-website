import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { Client, Invoice, InvoiceItem } from "@/domain/types";
import { computeInvoice, emptyInvoice, emptyItem } from "@/domain/invoice";
import { useRepo } from "@/features/admin/queries";
import { invoiceStatus, invoiceType, options } from "@/features/admin/labels";
import { formatToman, numberToWords, todayJalali } from "@/lib/persian";
import { PageTitle, Panel, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { StudioButton } from "@/components/primitives/button";

export const Route = createFileRoute("/admin/invoices/$id")({ component: InvoiceEditor });

function InvoiceEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const repo = useRepo<Invoice>("invoices");
  const clients = useRepo<Client>("clients").useList();
  const existing = repo.useOne(isNew ? undefined : id);
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Invoice | null>(isNew ? emptyInvoice(todayJalali()) : null);

  useEffect(() => {
    if (existing.data) setDraft(existing.data);
  }, [existing.data]);

  const inv = useMemo(() => (draft ? computeInvoice(draft) : null), [draft]);
  if (!inv) return <p className="text-muted-foreground">{existing.isLoading ? "در حال بارگذاری…" : "یافت نشد."}</p>;

  const set = <K extends keyof Invoice>(k: K, v: Invoice[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const setItem = (i: number, patch: Partial<InvoiceItem>) =>
    setDraft((d) => (d ? { ...d, items: d.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) } : d));
  const pickClient = (cid: string) => {
    const c = clients.data?.find((x) => x.id === cid);
    if (!c) return;
    setDraft((d) =>
      d && {
        ...d,
        clientId: c.id,
        buyerName: c.name,
        buyerCompany: c.company,
        buyerPhone: c.phone,
        buyerNationalId: c.nationalId,
        buyerEconomicCode: c.economicCode,
        buyerPostalCode: c.postalCode,
        buyerAddress: c.address,
      },
    );
  };

  const save = () =>
    repo.save.mutate(inv, { onSuccess: () => isNew && navigate({ to: "/admin/invoices/$id", params: { id: inv.id }, replace: true }) });

  return (
    <>
      <PageTitle
        title={isNew ? "فاکتور جدید" : `فاکتور ${inv.invoiceNumber}`}
        actions={
          <div className="flex gap-2">
            {!isNew && (
              <StudioButton asChild size="sm" variant="line">
                <Link to="/admin/invoice-print/$id" params={{ id: inv.id }}>نسخه چاپی</Link>
              </StudioButton>
            )}
            {!isNew && (
              <StudioButton size="sm" variant="ghost" onClick={() => confirm("حذف شود؟") && repo.remove.mutate(inv.id, { onSuccess: () => navigate({ to: "/admin/invoices" }) })}>
                حذف
              </StudioButton>
            )}
            <StudioButton size="sm" onClick={save} disabled={repo.save.isPending}>ذخیره</StudioButton>
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="مشخصات" className="xl:col-span-2">
          <div className="grid gap-4 md:grid-cols-3">
            <TextField label="شماره" value={inv.invoiceNumber} onChange={(e) => set("invoiceNumber", e.target.value)} />
            <SelectField label="نوع" value={inv.type} onChange={(v) => set("type", v)} options={options(invoiceType)} />
            <SelectField label="وضعیت" value={inv.status} onChange={(v) => set("status", v)} options={options(invoiceStatus)} />
            <TextField className="md:col-span-3" label="عنوان" value={inv.title} onChange={(e) => set("title", e.target.value)} />
            <TextField label="تاریخ صدور" value={inv.issueDate} onChange={(e) => set("issueDate", e.target.value)} />
            <TextField label="سررسید" value={inv.dueDate ?? ""} onChange={(e) => set("dueDate", e.target.value)} />
            <TextField label="روش پرداخت" value={inv.paymentMethod ?? ""} onChange={(e) => set("paymentMethod", e.target.value)} />
          </div>
        </Panel>
        <Panel title="خریدار">
          <div className="space-y-4">
            {!!clients.data?.length && (
              <SelectField
                label="انتخاب از مشتریان"
                value={inv.clientId ?? ""}
                onChange={pickClient}
                options={[{ value: "", label: "—" }, ...clients.data.map((c) => ({ value: c.id, label: c.name }))]}
              />
            )}
            <TextField label="نام خریدار" value={inv.buyerName} onChange={(e) => set("buyerName", e.target.value)} />
            <TextField label="شرکت" value={inv.buyerCompany ?? ""} onChange={(e) => set("buyerCompany", e.target.value)} />
            <TextField label="تلفن" dir="ltr" value={inv.buyerPhone ?? ""} onChange={(e) => set("buyerPhone", e.target.value)} />
          </div>
        </Panel>

        <Panel title="اقلام" className="xl:col-span-3" actions={<StudioButton size="sm" variant="line" onClick={() => set("items", [...inv.items, emptyItem()])}>ردیف جدید</StudioButton>}>
          <div className="space-y-3">
            {inv.items.map((it, i) => (
              <div key={it.id} className="grid items-end gap-3 rounded-xl border border-line p-3 md:grid-cols-12">
                <TextField className="md:col-span-4" label="شرح" value={it.description} onChange={(e) => setItem(i, { description: e.target.value })} />
                <TextField className="md:col-span-1" label="تعداد" type="number" value={it.quantity} onChange={(e) => setItem(i, { quantity: Number(e.target.value) })} />
                <TextField className="md:col-span-1" label="واحد" value={it.unit} onChange={(e) => setItem(i, { unit: e.target.value })} />
                <TextField className="md:col-span-2" label="فی (ریال)" type="number" value={it.unitPrice} onChange={(e) => setItem(i, { unitPrice: Number(e.target.value) })} />
                <TextField className="md:col-span-2" label="تخفیف" type="number" value={it.discount} onChange={(e) => setItem(i, { discount: Number(e.target.value) })} />
                <div className="flex items-center justify-between gap-2 md:col-span-2">
                  <span className="font-mono text-sm">{formatToman(it.totalPrice)}</span>
                  <button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => set("items", inv.items.filter((_, idx) => idx !== i))}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="توضیحات" className="xl:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <TextArea label="یادداشت" value={inv.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
            <TextArea label="شرایط" value={inv.terms ?? ""} onChange={(e) => set("terms", e.target.value)} />
          </div>
        </Panel>
        <Panel title="جمع">
          <div className="space-y-3 text-sm">
            <Row label="جمع اقلام" value={formatToman(inv.subtotal)} />
            <TextField label="تخفیف کلی (ریال)" type="number" value={inv.discountAmount} onChange={(e) => set("discountAmount", Number(e.target.value))} />
            <TextField label="مالیات (٪)" type="number" value={inv.taxPercent} onChange={(e) => set("taxPercent", Number(e.target.value))} />
            <Row label="مالیات" value={formatToman(inv.taxAmount)} />
            <div className="border-t border-line pt-3">
              <Row label="مبلغ نهایی" value={formatToman(inv.totalAmount)} strong />
              <p className="mt-2 text-xs text-muted-foreground">{numberToWords(inv.totalAmount)} ریال</p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "text-xl text-ember" : "font-mono"}>{value}</span>
    </div>
  );
}
