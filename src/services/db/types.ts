export interface Client {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  nationalId?: string;
  economicCode?: string;
  postalCode?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  itemOrder?: number;
}

export type InvoiceType = 'invoice' | 'proforma';
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType; // invoice = فاکتور فروش, proforma = پیش‌فاکتور
  title: string;
  clientId?: string;
  buyerName: string;
  buyerCompany?: string;
  buyerNationalId?: string;
  buyerEconomicCode?: string;
  buyerPhone?: string;
  buyerPostalCode?: string;
  buyerAddress?: string;
  issueDate: string; // e.g. ۱۴۰۴/۰۶/۲۰
  dueDate?: string;
  status: InvoiceStatus;
  subtotal: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod?: string;
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
  createdAt?: string;
  updatedAt?: string;
}

export type LetterType = 'official' | 'contract' | 'handover' | 'recommendation';
export type LetterStatus = 'draft' | 'published' | 'archived';

export interface OfficialLetter {
  id: string;
  letterNumber: string;
  letterDate: string; // e.g. ۱۴۰۴/۰۶/۲۰
  attachment: string; // e.g. دارد / ندارد / ۱ برگ
  type: LetterType;
  subject: string;
  recipientTitle: string; // e.g. مدیریت محترم شرکت ...
  recipientName?: string;
  recipientCompany?: string;
  body: string;
  signeeTitle: string; // e.g. مدیریت مهندسی و توسعه
  signeeName: string; // e.g. کاظم مریدی
  status: LetterStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudioProfile {
  id?: string;
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
  logoUrl?: string;
  stampSignatureUrl?: string;
}
