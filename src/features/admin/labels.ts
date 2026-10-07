import type { InvoiceStatus, InvoiceType, LetterStatus, LetterType } from "@/domain/types";

export const invoiceStatus: Record<InvoiceStatus, string> = {
  draft: "پیش‌نویس",
  pending: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  cancelled: "لغوشده",
};
export const invoiceType: Record<InvoiceType, string> = { invoice: "فاکتور فروش", proforma: "پیش‌فاکتور" };
export const letterType: Record<LetterType, string> = {
  official: "اداری",
  contract: "قرارداد",
  handover: "تحویل پروژه",
  recommendation: "معرفی‌نامه",
};
export const letterStatus: Record<LetterStatus, string> = { draft: "پیش‌نویس", published: "نهایی", archived: "بایگانی" };

export const options = <K extends string>(m: Record<K, string>) =>
  (Object.keys(m) as K[]).map((value) => ({ value, label: m[value] }));
