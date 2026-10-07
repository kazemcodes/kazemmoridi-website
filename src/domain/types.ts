export interface Client {
  id: string;
  name: string;
  company?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  nationalId?: string | undefined;
  economicCode?: string | undefined;
  postalCode?: string | undefined;
  address?: string | undefined;
  createdAt?: string | undefined;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export type InvoiceType = "invoice" | "proforma";
export type InvoiceStatus = "draft" | "pending" | "paid" | "cancelled";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  title: string;
  clientId?: string | undefined;
  buyerName: string;
  buyerCompany?: string | undefined;
  buyerNationalId?: string | undefined;
  buyerEconomicCode?: string | undefined;
  buyerPhone?: string | undefined;
  buyerPostalCode?: string | undefined;
  buyerAddress?: string | undefined;
  issueDate: string;
  dueDate?: string | undefined;
  status: InvoiceStatus;
  subtotal: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod?: string | undefined;
  notes?: string | undefined;
  terms?: string | undefined;
  items: InvoiceItem[];
  createdAt?: string | undefined;
}

export type LetterType = "official" | "contract" | "handover" | "recommendation";
export type LetterStatus = "draft" | "published" | "archived";

export interface OfficialLetter {
  id: string;
  letterNumber: string;
  letterDate: string;
  attachment: string;
  type: LetterType;
  subject: string;
  recipientTitle: string;
  recipientName?: string | undefined;
  recipientCompany?: string | undefined;
  body: string;
  signeeTitle: string;
  signeeName: string;
  status: LetterStatus;
  createdAt?: string | undefined;
}

export interface StudioProfile {
  id?: string | undefined;
  brandName: string;
  managerName: string;
  nationalId: string;
  economicCode: string;
  registrationNumber: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  website: string;
  shebaNumber: string;
  cardNumber: string;
  bankName: string;
  address: string;
  postalCode: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact: string;
  budget?: string | undefined;
  timeline?: string | undefined;
  message: string;
  locale: string;
  read: boolean;
  createdAt: string;
}

export interface NewContactMessage {
  name: string;
  contact: string;
  budget?: string | undefined;
  timeline?: string | undefined;
  message: string;
  locale: string;
}

export interface AdminUser {
  id: string;
  email: string;
}
