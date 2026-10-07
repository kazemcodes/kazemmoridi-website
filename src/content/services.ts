import type { Localized } from "@/i18n/locale";

export interface Service {
  id: string;
  title: Localized<string>;
  summary: Localized<string>;
  features: Localized<string[]>;
  tags: string[];
}

export const services: Service[] = [
  {
    id: "ecommerce",
    title: { fa: "فروشگاه اینترنتی", en: "E-commerce" },
    summary: {
      fa: "فروشگاه‌های سریع با WooCommerce یا Laravel اختصاصی؛ درگاه شتاب، انبارداری، فاکتور رسمی و سبد خرید بهینه.",
      en: "Fast stores on WooCommerce or custom Laravel — Shetab payments, inventory, official invoices and an optimised checkout.",
    },
    features: {
      fa: ["درگاه مستقیم و واسط بانکی", "کوپن، تخفیف هوشمند و کش‌بک", "انبار، تنوع محصول و رهگیری پیامکی", "لود زیر ۲ ثانیه روی موبایل"],
      en: ["Direct and intermediary bank gateways", "Smart discounts, coupons and cashback", "Inventory, variants and SMS tracking", "Under 2s on mobile networks"],
    },
    tags: ["Laravel", "WooCommerce", "Payments"],
  },
  {
    id: "platforms",
    title: { fa: "سامانه و پلتفرم اختصاصی", en: "Custom platforms" },
    summary: {
      fa: "پرتال سازمانی، سامانه آموزشی و مدارس، داشبورد مدیریتی و SaaS با Laravel 13، Svelte 5 و Filament.",
      en: "Enterprise portals, school systems, dashboards and SaaS on Laravel 13, Svelte 5 and Filament.",
    },
    features: {
      fa: ["معماری ماژولار بدون قالب آماده", "پنل مدیریت امن با Filament", "سطوح دسترسی پیشرفته", "گزارش اکسل و نمودار تحلیلی"],
      en: ["Modular, theme-free architecture", "Secure Filament admin panels", "Fine-grained roles and permissions", "Excel exports and analytics"],
    },
    tags: ["Laravel 13", "Svelte 5", "SaaS"],
  },
  {
    id: "design",
    title: { fa: "طراحی رابط و تجربه کاربری", en: "UI / UX design" },
    summary: {
      fa: "هویت بصری، وایرفریم و پروتوتایپ تعاملی در فیگما، بومی‌شده برای کاربر ایرانی با RTL و تقویم جلالی.",
      en: "Visual identity, wireframes and interactive Figma prototypes, localised for Iranian users with RTL and the Jalali calendar.",
    },
    features: {
      fa: ["دیزاین سیستم اختصاصی در فیگما", "تایپوگرافی و رنگ استاندارد فارسی", "نسخه موبایل، تبلت و دسکتاپ", "بهینه‌سازی نرخ تبدیل"],
      en: ["Bespoke Figma design systems", "Persian typography and colour craft", "Mobile, tablet and desktop layouts", "Conversion-rate optimisation"],
    },
    tags: ["Figma", "Design systems", "RTL"],
  },
  {
    id: "performance",
    title: { fa: "سرعت و سئو تکنیکال", en: "Performance & SEO" },
    summary: {
      fa: "امتیاز ۹۵+ لایت‌هاوس، کش چندلایه، دیتابیس بهینه و سئو ساختاریافته برای رتبه‌های برتر گوگل.",
      en: "95+ Lighthouse scores, layered caching, tuned databases and structured SEO for top Google rankings.",
    },
    features: {
      fa: ["Core Web Vitals", "فشرده‌سازی مدرن CSS و JS", "Schema.org و OpenGraph", "امنیت ضد نفوذ و SSL"],
      en: ["Core Web Vitals", "Modern CSS/JS compression", "Schema.org and OpenGraph", "Hardened security and SSL"],
    },
    tags: ["Lighthouse", "SEO", "Schema"],
  },
  {
    id: "apps",
    title: { fa: "اپلیکیشن چندپلتفرمی", en: "Cross-platform apps" },
    summary: {
      fa: "اپ اندروید، iOS و دسکتاپ با Flutter و Kotlin Multiplatform، متصل به سخت‌افزار فروشگاهی.",
      en: "Android, iOS and desktop apps with Flutter and Kotlin Multiplatform, connected to retail hardware.",
    },
    features: {
      fa: ["یک کد، اجرای نیتیو", "پوز، بارکدخوان و پرینتر", "اعلان لحظه‌ای", "۶۰ فریم بر ثانیه"],
      en: ["One codebase, native performance", "POS, barcode and printer support", "Push notifications", "Smooth 60fps"],
    },
    tags: ["Flutter", "Kotlin", "POS"],
  },
  {
    id: "devops",
    title: { fa: "استقرار، امنیت و پشتیبانی", en: "Hosting, security & care" },
    summary: {
      fa: "استقرار اقتصادی روی هاست اشتراکی یا سرور ابری با Docker و CI/CD، پشتیبان‌گیری و مانیتورینگ.",
      en: "Cost-efficient hosting on shared or cloud servers with Docker and CI/CD, backups and monitoring.",
    },
    features: {
      fa: ["مصرف حداقل منابع سرور", "استقرار خودکار با Git", "پشتیبان‌گیری منظم", "مانیتورینگ شبانه‌روزی"],
      en: ["Minimal server footprint", "Automated Git deployments", "Scheduled backups", "Round-the-clock monitoring"],
    },
    tags: ["Docker", "CI/CD", "Monitoring"],
  },
];
