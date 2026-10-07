import type { Localized } from "@/i18n/locale";

export interface Testimonial {
  quote: Localized<string>;
  author: Localized<string>;
  company: Localized<string>;
}

export const testimonials: Testimonial[] = [
  {
    quote: {
      fa: "سامانه فرماهان هزینه‌های گزاف نرم‌افزار مدرسه را از بین برد. سبک، سریع و هماهنگ با نیاز مدارس فنی است و پشتیبانی همیشه در دسترس بوده.",
      en: "Farmahan wiped out our huge school-software costs. It's light, fast and fits technical colleges perfectly — and support has always been there.",
    },
    author: { fa: "مدیریت هنرستان‌های فرهنگ ماهان", en: "Director, Farhang Mahan Colleges" },
    company: { fa: "farmahan.ir", en: "farmahan.ir" },
  },
  {
    quote: {
      fa: "سرعت برای ما حیاتی بود. با لاراول و ریکت، صفحات و ثبت سفارش فوق‌العاده سریع شد و مشتری بدون معطلی خرید می‌کند.",
      en: "Speed was critical for us. With Laravel and React, pages and checkout became incredibly fast — customers buy without waiting.",
    },
    author: { fa: "مالک فروشگاه کالا خش", en: "Owner, Kalakhash" },
    company: { fa: "kalakhash.ir", en: "kalakhash.ir" },
  },
  {
    quote: {
      fa: "طراحی موبایل‌محور باعث افزایش محسوس نرخ تبدیل و کاهش سبدهای رهاشده شد. درگاه و پیامک‌ها بی‌نقص کار می‌کنند.",
      en: "The mobile-first design noticeably lifted conversion and cut abandoned carts. Payments and SMS work flawlessly.",
    },
    author: { fa: "مدیر فروش دوبکالا", en: "Head of sales, Dubakala" },
    company: { fa: "dubakala.ir", en: "dubakala.ir" },
  },
];
