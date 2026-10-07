import type { Localized } from "@/i18n/locale";

export const contact = {
  phone: "+989170284463",
  phoneDisplay: { fa: "۰۹۱۷ ۰۲۸ ۴۴۶۳", en: "+98 917 028 4463" } as Localized<string>,
  email: "kazem.codes@gmail.com",
  github: "https://github.com/kazemcodes",
  linkedin: "https://www.linkedin.com/in/kazem-moridi-173796214/",
  telegram: "https://t.me/I_am_kazem",
  bale: "https://ble.ir/kazem_moridi",
  whatsapp: "https://wa.me/989170284463",
  location: {
    fa: "هرمزگان، ایران — خدمات حضوری و آنلاین در سراسر کشور",
    en: "Hormozgan, Iran — working on-site and remotely nationwide",
  } as Localized<string>,
  hours: {
    fa: "شنبه تا پنج‌شنبه، ۹ تا ۲۱",
    en: "Sat–Thu, 9:00–21:00",
  } as Localized<string>,
};

export const socials = [
  { label: "Bale", href: contact.bale },
  { label: "Telegram", href: contact.telegram },
  { label: "WhatsApp", href: contact.whatsapp },
  { label: "GitHub", href: contact.github },
  { label: "LinkedIn", href: contact.linkedin },
];

export const stats: { value: Localized<string>; label: Localized<string> }[] = [
  { value: { fa: "+۱۵", en: "15+" }, label: { fa: "محصول تحویل‌شده", en: "Products shipped" } },
  { value: { fa: "۵", en: "5" }, label: { fa: "هنرستان روی سامانه ما", en: "Colleges on our platform" } },
  { value: { fa: "زیر ۲ ثانیه", en: "Under 2s" }, label: { fa: "هدف سرعت بارگذاری", en: "Load speed target" } },
  { value: { fa: "+۸۷۰", en: "870+" }, label: { fa: "ستاره گیت‌هاب", en: "GitHub stars" } },
];

export const capabilities = ["Laravel", "React", "Svelte", "Flutter", "WooCommerce", "Filament", "Cloudflare", "Figma", "Three.js", "PostgreSQL"];

export const about = {
  title: { fa: "استودیویی کوچک، با استانداردهای بزرگ.", en: "A small studio with big standards." },
  body: {
    fa: [
      "KM Studio یک استودیو طراحی و مهندسی وب در جنوب ایران است. ما محصولاتی می‌سازیم که سریع بارگذاری می‌شوند، ارزان نگه‌داری می‌شوند و برای کاربر فارسی‌زبان طراحی شده‌اند.",
      "به‌جای قالب‌های آماده و افزونه‌های سنگین، هر پروژه را با معماری تمیز و کد اختصاصی می‌نویسیم — از فروشگاه اینترنتی تا سامانه‌های آموزشی که هر روز هزاران دانش‌آموز از آن استفاده می‌کنند.",
    ],
    en: [
      "KM Studio is a web design and engineering studio in southern Iran. We build products that load fast, cost little to run, and are designed for Persian-speaking users first.",
      "Instead of off-the-shelf themes and heavy plugins, every project is written with clean architecture and custom code — from online stores to education platforms thousands of students use every day.",
    ],
  } as Localized<string[]>,
  principles: [
    { title: { fa: "سرعت، یک ویژگی است", en: "Speed is a feature" }, body: { fa: "هر صفحه زیر دو ثانیه، روی اینترنت موبایل.", en: "Every page under two seconds, on mobile data." } },
    { title: { fa: "کد تمیز، هزینه کمتر", en: "Clean code, lower cost" }, body: { fa: "معماری ماژولار که سال‌ها قابل توسعه می‌ماند.", en: "Modular architecture that stays extendable for years." } },
    { title: { fa: "بومی از روز اول", en: "Native from day one" }, body: { fa: "RTL واقعی، تقویم جلالی و تایپوگرافی فارسی.", en: "True RTL, Jalali calendar and Persian typography." } },
  ],
};
