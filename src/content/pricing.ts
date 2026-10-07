import type { Localized } from "@/i18n/locale";

export interface ProjectType {
  id: string;
  title: Localized<string>;
  desc: Localized<string>;
  /** Million Toman */
  basePrice: number;
  baseDays: number;
}

export interface AddOn {
  id: string;
  title: Localized<string>;
  price: number;
  days: number;
  recommended?: boolean;
}

export const projectTypes: ProjectType[] = [
  { id: "store", title: { fa: "فروشگاه اینترنتی", en: "Online store" }, desc: { fa: "درگاه پرداخت، فاکتور و انبارداری", en: "Payments, invoicing and inventory" }, basePrice: 15, baseDays: 14 },
  { id: "platform", title: { fa: "سامانه اختصاصی", en: "Custom platform" }, desc: { fa: "پرتال، سیستم آموزشی، رزرو یا SaaS", en: "Portal, LMS, booking or SaaS" }, basePrice: 24, baseDays: 25 },
  { id: "corporate", title: { fa: "وب‌سایت شرکتی", en: "Company website" }, desc: { fa: "معرفی برند و جذب لید", en: "Brand presence and lead capture" }, basePrice: 9, baseDays: 10 },
  { id: "app", title: { fa: "اپلیکیشن / PWA", en: "App / PWA" }, desc: { fa: "موبایل و دسکتاپ با فلاتر", en: "Mobile and desktop with Flutter" }, basePrice: 18, baseDays: 20 },
];

export const addOns: AddOn[] = [
  { id: "payment", title: { fa: "درگاه بانکی شاپرک", en: "Shaparak payment gateway" }, price: 1.5, days: 2, recommended: true },
  { id: "sms", title: { fa: "سامانه پیامکی سفارشات", en: "Order SMS notifications" }, price: 1.2, days: 1, recommended: true },
  { id: "seo", title: { fa: "پکیج سئو تکنیکال", en: "Technical SEO package" }, price: 3.5, days: 4, recommended: true },
  { id: "multilingual", title: { fa: "چندزبانه", en: "Multilingual" }, price: 4, days: 5 },
  { id: "exam", title: { fa: "آزمون‌ساز آنلاین", en: "Online exam builder" }, price: 4.5, days: 6 },
  { id: "pos", title: { fa: "اتصال به پوز فروشگاهی", en: "Retail POS integration" }, price: 3, days: 4 },
  { id: "blog", title: { fa: "بلاگ سئومحور", en: "SEO blog" }, price: 1.8, days: 2 },
  { id: "support", title: { fa: "پشتیبانی VIP یک‌ساله", en: "1-year VIP support" }, price: 5, days: 0, recommended: true },
];

/** Pure estimate function — UI-independent and unit-testable. */
export function estimate(typeId: string, addOnIds: string[]) {
  const type = projectTypes.find((t) => t.id === typeId) ?? projectTypes[0]!;
  const chosen = addOns.filter((a) => addOnIds.includes(a.id));
  const price = type.basePrice + chosen.reduce((s, a) => s + a.price, 0);
  const days = type.baseDays + chosen.reduce((s, a) => s + a.days, 0);
  return { price: { min: Math.round(price * 0.9 * 10) / 10, max: Math.round(price * 1.2 * 10) / 10 }, days };
}
