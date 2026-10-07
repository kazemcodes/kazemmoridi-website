import type { Localized } from "@/i18n/locale";

export interface ProcessStep {
  title: Localized<string>;
  body: Localized<string>;
  deliverables: Localized<string[]>;
}

export const processSteps: ProcessStep[] = [
  {
    title: { fa: "نیازسنجی و استراتژی", en: "Discovery & strategy" },
    body: {
      fa: "اهداف تجاری، مخاطب و نیاز فنی را بررسی و معماری و استک متناسب با بودجه را پیشنهاد می‌دهیم.",
      en: "We map business goals, audience and technical needs, then propose an architecture and stack that fit the budget.",
    },
    deliverables: { fa: ["سند نیازمندی‌ها", "پیشنهاد معماری", "برآورد زمان و هزینه"], en: ["Requirements doc", "Architecture proposal", "Time & cost estimate"] },
  },
  {
    title: { fa: "طراحی رابط کاربری", en: "Interface design" },
    body: {
      fa: "وایرفریم و پروتوتایپ تعاملی در فیگما با هارمونی برند و تایپوگرافی فارسی؛ پس از تایید، کدنویسی.",
      en: "Wireframes and interactive Figma prototypes in your brand's voice. Code starts only after your sign-off.",
    },
    deliverables: { fa: ["پروتوتایپ فیگما", "نسخه موبایل و تبلت", "تایید کارفرما"], en: ["Figma prototype", "Mobile & tablet layouts", "Client sign-off"] },
  },
  {
    title: { fa: "توسعه تمیز", en: "Clean engineering" },
    body: {
      fa: "فرانت‌اند و بک‌اند اختصاصی با Clean Architecture، امن و سریع، بدون قالب و افزونه سنگین.",
      en: "Custom front and back end on clean architecture — secure and fast, without themes or heavy plugins.",
    },
    deliverables: { fa: ["کد استاندارد", "پنل مدیریت اختصاصی", "اتصال درگاه و وب‌سرویس"], en: ["Standards-based code", "Custom admin panel", "Payments & integrations"] },
  },
  {
    title: { fa: "تست، سرعت و سئو", en: "Testing, speed & SEO" },
    body: {
      fa: "تست در همه مرورگرها و دستگاه‌ها، لود زیر ۲ ثانیه، سئو تکنیکال و بررسی امنیت.",
      en: "Cross-browser and device testing, sub-2s loads, technical SEO and a security review.",
    },
    deliverables: { fa: ["تست جامع", "لایت‌هاوس ۹۰+", "ایندکس گوگل"], en: ["Full QA", "Lighthouse 90+", "Google indexing"] },
  },
  {
    title: { fa: "استقرار و پشتیبانی", en: "Launch & support" },
    body: {
      fa: "راه‌اندازی نهایی، آموزش کار با پنل و پشتیبانی فنی اختصاصی برای عملکرد پایدار.",
      en: "Go-live, hands-on training for your team and dedicated support to keep things running.",
    },
    deliverables: { fa: ["استقرار روی دامنه", "ویدیوی آموزشی", "پشتیبانی تضمینی"], en: ["Domain deployment", "Training video", "Guaranteed support"] },
  },
];
