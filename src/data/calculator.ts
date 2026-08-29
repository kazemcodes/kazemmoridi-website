export interface ProjectTypeOption {
  id: string;
  title: string;
  desc: string;
  icon: string;
  basePrice: number; // in million Tomans
  baseDays: number;
}

export interface FeatureOption {
  id: string;
  title: string;
  price: number; // in million Tomans
  days: number;
  recommended?: boolean;
}

export const projectTypes: ProjectTypeOption[] = [
  {
    id: 'store',
    title: 'فروشگاه اینترنتی آنلاین',
    desc: 'فروشگاه استاندارد یا اختصاصی با درگاه پرداخت، فاکتور و انبارداری',
    icon: '🛍️',
    basePrice: 15,
    baseDays: 14
  },
  {
    id: 'platform',
    title: 'سامانه یا پلتفرم اختصاصی',
    desc: 'پرتال سازمانی، سیستم آموزشی، سامانه رزرو یا نرم‌افزار SaaS',
    icon: '🏢',
    basePrice: 24,
    baseDays: 25
  },
  {
    id: 'corporate',
    title: 'وب‌سایت شرکتی و معرفی برند',
    desc: 'وب‌سایت مدرن با طراحی اختصاصی، معرفی خدمات و جذب لید',
    icon: '💼',
    basePrice: 9,
    baseDays: 10
  },
  {
    id: 'app',
    title: 'اپلیکیشن چندپلتفرمی یا PWA',
    desc: 'نرم‌افزار موبایل و دسکتاپ متصل به وب‌سایت با فلاتر',
    icon: '📱',
    basePrice: 18,
    baseDays: 20
  }
];

export const featureOptions: FeatureOption[] = [
  { id: 'payment', title: 'اتصال به درگاه بانکی شاپرک و درگاه واسط', price: 1.5, days: 2, recommended: true },
  { id: 'sms', title: 'سامانه پیامکی اطلاع‌رسانی لحظه‌ای سفارشات', price: 1.2, days: 1, recommended: true },
  { id: 'seo_adv', title: 'پکیج سئو تکنیکال و کانفیگ اسکیمای پیشرفته', price: 3.5, days: 4, recommended: true },
  { id: 'multilingual', title: 'پشتیبانی از چندزبانه (انگلیسی / عربی / ترکی)', price: 4.0, days: 5 },
  { id: 'exam', title: 'ماژول آزمون‌ساز آنلاین یا نظرسنجی پیشرفته', price: 4.5, days: 6 },
  { id: 'pos', title: 'اتصال به دستگاه کارت‌خوان و پوز فروشگاهی', price: 3.0, days: 4 },
  { id: 'blog', title: 'بخش مقالات، بلاگ سئومحور و کامنت‌ها', price: 1.8, days: 2 },
  { id: 'support_vip', title: 'پشتیبانی فنی و نگهداری VIP یک‌ساله', price: 5.0, days: 0, recommended: true }
];
