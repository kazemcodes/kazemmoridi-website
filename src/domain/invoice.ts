import type { Invoice, InvoiceItem } from "./types";

/** Pure invoice math — shared by editor, print view and any backend. */
export function computeItem(item: InvoiceItem): InvoiceItem {
  const gross = item.quantity * item.unitPrice;
  return { ...item, totalPrice: Math.max(0, gross - item.discount) };
}

export function computeInvoice(invoice: Invoice): Invoice {
  const items = invoice.items.map(computeItem);
  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
  const afterDiscount = Math.max(0, subtotal - invoice.discountAmount);
  const taxAmount = Math.round((afterDiscount * invoice.taxPercent) / 100);
  return { ...invoice, items, subtotal, taxAmount, totalAmount: afterDiscount + taxAmount };
}

export function newId(): string {
  return crypto.randomUUID();
}

export function emptyItem(): InvoiceItem {
  return { id: newId(), description: "", quantity: 1, unit: "مورد", unitPrice: 0, discount: 0, totalPrice: 0 };
}

export function emptyInvoice(issueDate: string): Invoice {
  return {
    id: newId(),
    invoiceNumber: `KM-${Date.now().toString().slice(-6)}`,
    type: "invoice",
    title: "",
    buyerName: "",
    issueDate,
    status: "pending",
    subtotal: 0,
    discountAmount: 0,
    taxPercent: 0,
    taxAmount: 0,
    totalAmount: 0,
    paymentMethod: "کارت به کارت / حواله بانکی",
    items: [emptyItem()],
  };
}
