import { createFileRoute } from "@tanstack/react-router";
import type { Invoice } from "@/domain/types";
import { useRepo } from "@/features/admin/queries";
import { invoiceType } from "@/features/admin/labels";
import { formatToman, numberToWords, toFa } from "@/lib/persian";
import { PrintSheet } from "@/components/admin/print-sheet";

export const Route = createFileRoute("/admin/invoice-print/$id")({ component: InvoicePrint });

function InvoicePrint() {
  const { id } = Route.useParams();
  const { data: inv } = useRepo<Invoice>("invoices").useOne(id);
  if (!inv) return <p className="text-muted-foreground">در حال بارگذاری…</p>;

  return (
    <PrintSheet back={{ to: `/admin/invoices/${inv.id}`, label: "بازگشت" }}>
      {(profile) => (
        <div className="text-sm">
          <div className="mb-6 flex items-end justify-between">
            <h1 className="text-xl font-bold">{invoiceType[inv.type]}</h1>
            <div className="text-xs leading-6">
              <div>شماره: {inv.invoiceNumber}</div>
              <div>تاریخ: {inv.issueDate}</div>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-paper-ink/15 p-4 text-xs leading-6">
            <div>
              <div className="font-bold">فروشنده</div>
              <div>{profile?.managerName}</div>
              <div>شناسه ملی: {profile?.nationalId}</div>
              <div>کد اقتصادی: {profile?.economicCode}</div>
            </div>
            <div>
              <div className="font-bold">خریدار</div>
              <div>{inv.buyerName} {inv.buyerCompany && `— ${inv.buyerCompany}`}</div>
              {inv.buyerNationalId && <div>شناسه ملی: {inv.buyerNationalId}</div>}
              {inv.buyerPhone && <div>تلفن: {inv.buyerPhone}</div>}
              {inv.buyerAddress && <div>{inv.buyerAddress}</div>}
            </div>
          </div>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-paper-ink/5">
                {["ردیف", "شرح", "تعداد", "واحد", "فی", "تخفیف", "مبلغ"].map((h) => (
                  <th key={h} className="border border-paper-ink/15 p-2 text-start">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inv.items.map((it, i) => (
                <tr key={it.id}>
                  <td className="border border-paper-ink/15 p-2">{toFa(i + 1)}</td>
                  <td className="border border-paper-ink/15 p-2">{it.description}</td>
                  <td className="border border-paper-ink/15 p-2">{toFa(it.quantity)}</td>
                  <td className="border border-paper-ink/15 p-2">{it.unit}</td>
                  <td className="border border-paper-ink/15 p-2">{formatToman(it.unitPrice)}</td>
                  <td className="border border-paper-ink/15 p-2">{formatToman(it.discount)}</td>
                  <td className="border border-paper-ink/15 p-2">{formatToman(it.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ms-auto mt-6 w-72 space-y-2 text-xs">
            <div className="flex justify-between"><span>جمع</span><span>{formatToman(inv.subtotal)}</span></div>
            <div className="flex justify-between"><span>تخفیف</span><span>{formatToman(inv.discountAmount)}</span></div>
            <div className="flex justify-between"><span>مالیات ({toFa(inv.taxPercent)}٪)</span><span>{formatToman(inv.taxAmount)}</span></div>
            <div className="flex justify-between border-t border-paper-ink/30 pt-2 text-base font-bold"><span>مبلغ نهایی (ریال)</span><span>{formatToman(inv.totalAmount)}</span></div>
          </div>
          <p className="mt-4 text-xs">به حروف: {numberToWords(inv.totalAmount)} ریال</p>
          {profile && (
            <div className="mt-8 rounded-lg border border-paper-ink/15 p-4 text-xs leading-6">
              <div className="font-bold">اطلاعات پرداخت — {inv.paymentMethod}</div>
              <div>{profile.bankName}</div>
              <div dir="ltr" className="text-end">{profile.cardNumber} · {profile.shebaNumber}</div>
            </div>
          )}
          {inv.terms && <p className="mt-6 whitespace-pre-wrap text-xs opacity-80">{inv.terms}</p>}
          <div className="mt-16 grid grid-cols-2 text-center text-xs">
            <div>مهر و امضای فروشنده</div>
            <div>مهر و امضای خریدار</div>
          </div>
        </div>
      )}
    </PrintSheet>
  );
}
