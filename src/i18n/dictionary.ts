import type { Localized } from "./locale";

/** UI copy. Page-specific long-form content lives in src/content. */
export const dictionary = {
  nav: {
    services: { fa: "خدمات", en: "Services" },
    work: { fa: "نمونه‌کارها", en: "Work" },
    process: { fa: "فرآیند", en: "Process" },
    pricing: { fa: "برآورد هزینه", en: "Pricing" },
    about: { fa: "استودیو", en: "Studio" },
    contact: { fa: "تماس", en: "Contact" },
  },
  cta: {
    start: { fa: "شروع پروژه", en: "Start a project" },
    viewWork: { fa: "مشاهده پروژه", en: "View project" },
    allWork: { fa: "همه پروژه‌ها", en: "All work" },
    visit: { fa: "مشاهده سایت", en: "Visit site" },
    source: { fa: "کد منبع", en: "Source" },
  },
  hero: {
    eyebrow: { fa: "استودیو طراحی و توسعه وب — هرمزگان", en: "Web design & engineering studio — Iran" },
    title: {
      fa: ["محصول دیجیتال", "می‌سازیم که", "سریع‌تر می‌فروشد."],
      en: ["We build digital", "products that", "sell faster."],
    },
    lede: {
      fa: "KM Studio برای کسب‌وکارها، مدارس و استارتاپ‌ها فروشگاه، سامانه و اپلیکیشن اختصاصی می‌سازد — سبک، امن و زیر دو ثانیه.",
      en: "KM Studio designs and engineers stores, platforms and apps for businesses, schools and startups — lean, secure and loading in under two seconds.",
    },
    scroll: { fa: "اسکرول کنید", en: "Scroll" },
  },
  sections: {
    services: { fa: "آنچه می‌سازیم", en: "What we build" },
    work: { fa: "پروژه‌های منتخب", en: "Selected work" },
    process: { fa: "روش کار استودیو", en: "How the studio works" },
    voices: { fa: "صدای کارفرمایان", en: "Client voices" },
  },
  ctaBand: {
    title: { fa: "پروژه بعدی شما، از همین‌جا.", en: "Your next product starts here." },
    body: {
      fa: "ایده یا نیازتان را بگویید؛ ظرف ۲۴ ساعت با برآورد شفاف زمان و هزینه پاسخ می‌دهیم.",
      en: "Tell us what you need — we reply within 24 hours with a transparent time and cost estimate.",
    },
  },
  footer: {
    rights: { fa: "تمامی حقوق محفوظ است.", en: "All rights reserved." },
    tagline: { fa: "طراحی و مهندسی محصولات وب.", en: "Design & engineering for the web." },
  },
  contact: {
    name: { fa: "نام شما", en: "Your name" },
    email: { fa: "ایمیل یا شماره تماس", en: "Email or phone" },
    budget: { fa: "بودجه تقریبی", en: "Approximate budget" },
    message: { fa: "درباره پروژه بگویید", en: "Tell us about the project" },
    send: { fa: "ارسال پیام", en: "Send message" },
    sending: { fa: "در حال ارسال…", en: "Sending…" },
    sent: { fa: "پیام شما رسید. به‌زودی تماس می‌گیریم.", en: "Message received. We'll be in touch shortly." },
    failed: { fa: "ارسال نشد. لطفاً از طریق بله یا ایمیل پیام دهید.", en: "Couldn't send. Please reach us via email or Bale." },
  },
  pricing: {
    type: { fa: "نوع پروژه", en: "Project type" },
    features: { fa: "امکانات اضافه", en: "Add-ons" },
    estimate: { fa: "برآورد اولیه", en: "Initial estimate" },
    currency: { fa: "میلیون تومان", en: "M Toman" },
    days: { fa: "روز کاری", en: "working days" },
    note: {
      fa: "برآورد تقریبی است و پس از جلسه نیازسنجی نهایی می‌شود.",
      en: "This is a rough estimate, finalised after the discovery call.",
    },
    recommended: { fa: "پیشنهادی", en: "Recommended" },
  },
} satisfies Record<string, Record<string, Localized<unknown>>>;
