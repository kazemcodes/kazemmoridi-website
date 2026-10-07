import type { Localized } from "@/i18n/locale";

export type ProjectCategory = "websites" | "apps" | "tools";
export type ProjectStatus = "live" | "deploying" | "open-source";

export interface Project {
  slug: string;
  year: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured?: boolean;
  url: string;
  displayUrl: string;
  githubUrl?: string;
  title: Localized<string>;
  discipline: Localized<string>;
  tagline: Localized<string>;
  description: Localized<string>;
  highlights: Localized<string[]>;
  stack: string[];
  stats?: Localized<{ label: string; value: string }[]>;
  /** Hue (oklch) used for the project's generated cover art. */
  hue: number;
  /** Screenshot of the live site under /public, when one could be captured. */
  preview?: string;
}

export const categoryLabels: Record<ProjectCategory, Localized<string>> = {
  websites: { fa: "وب و سامانه", en: "Web & platforms" },
  apps: { fa: "اپلیکیشن", en: "Apps" },
  tools: { fa: "ابزار و متن‌باز", en: "Tools & open source" },
};

export const statusLabels: Record<ProjectStatus, Localized<string>> = {
  live: { fa: "فعال", en: "Live" },
  deploying: { fa: "در حال استقرار", en: "Deploying" },
  "open-source": { fa: "متن‌باز", en: "Open source" },
};

export const projects: Project[] = [
  {
    slug: "farmahan",
    preview: "/projects/farmahan.jpg",
    year: "2025",
    category: "websites",
    status: "live",
    featured: true,
    url: "https://farmahan.ir",
    displayUrl: "farmahan.ir",
    hue: 48,
    title: { fa: "سامانه مدیریت مدارس فرهنگ ماهان", en: "Farmahan School Platform" },
    discipline: { fa: "سامانه ابری آموزشی", en: "EdTech cloud platform" },
    tagline: {
      fa: "مدیریت مدارس، آزمون‌ساز آنلاین، ثبت‌نام و رهگیری ویدیوهای آموزشی در یک پلتفرم.",
      en: "School management, online exams, enrolment and lesson tracking in one platform.",
    },
    description: {
      fa: "سامانه جامع و سبک با معماری اختصاصی Laravel 13 و Svelte 5. نیاز به نرم‌افزارهای سنگین و گران را از میان برداشت و با استقرار کم‌هزینه، هم‌اکنون ۵ هنرستان کشاورزی و صنعتی را پشتیبانی می‌کند.",
      en: "A lean, all-in-one system on a custom Laravel 13 + Svelte 5 architecture. It replaced heavy, expensive school software and now runs five agricultural and technical colleges on low-cost hosting.",
    },
    highlights: {
      fa: ["مدیریت ۵ هنرستان فعال در هرمزگان", "Laravel 13 + Svelte 5 + Filament", "تقویم جلالی، آزمون‌ساز و پنل دانش‌آموز", "کاهش ۹۰٪ هزینه سرور با کش بهینه"],
      en: ["Runs 5 active colleges in Hormozgan", "Laravel 13 + Svelte 5 + Filament", "Jalali calendar, exam builder, student portal", "90% lower server cost through caching"],
    },
    stack: ["Laravel 13", "Svelte 5", "Filament", "Inertia.js", "MySQL"],
    stats: {
      fa: [
        { label: "مدارس", value: "۵" },
        { label: "زمان بارگذاری", value: "۱٫۲ ثانیه" },
        { label: "آپ‌تایم", value: "۹۹٫۹٪" },
      ],
      en: [
        { label: "Schools", value: "5" },
        { label: "Avg. load", value: "1.2s" },
        { label: "Uptime", value: "99.9%" },
      ],
    },
  },
  {
    slug: "icount",
    year: "2025",
    category: "apps",
    status: "deploying",
    featured: true,
    url: "https://icount.ir",
    displayUrl: "icount.ir",
    hue: 160,
    title: { fa: "آی‌کنت — حسابداری و پوز ابری", en: "iCount — Cloud accounting & POS" },
    discipline: { fa: "نرم‌افزار چندپلتفرمی", en: "Cross-platform software" },
    tagline: {
      fa: "حسابداری، انبارداری و صندوق فروشگاهی چندپلتفرمی با فلاتر.",
      en: "Cross-platform accounting, inventory and point-of-sale built with Flutter.",
    },
    description: {
      fa: "سامانه ابری حسابداری فروشگاهی برای مدیریت موجودی، صدور آنی فاکتور با پرینتر حرارتی، گزارش سود و زیان و همگام‌سازی لحظه‌ای میان شعب.",
      en: "Cloud retail accounting: live inventory, instant thermal-printer invoices, profit and loss reports and real-time sync across branches and devices.",
    },
    highlights: {
      fa: ["ویندوز، مک، اندروید و تبلت", "ثبت فاکتور زیر ۵ ثانیه با پوز بانکی", "چند انبار و سطوح دسترسی"],
      en: ["Windows, macOS, Android and tablets", "Sub-5s invoicing with bank POS", "Multi-warehouse with staff roles"],
    },
    stack: ["Flutter", "Dart", "REST API", "POS"],
  },
  {
    slug: "kalakhash",
    year: "2024",
    category: "websites",
    status: "live",
    featured: true,
    url: "http://kalakhash.ir",
    displayUrl: "kalakhash.ir",
    hue: 15,
    title: { fa: "فروشگاه عطر کالاخش", en: "Kalakhash Perfumery" },
    discipline: { fa: "فروشگاه آنلاین", en: "E-commerce" },
    tagline: {
      fa: "فروشگاه SPA مدرن با لاراول و ریکت.",
      en: "A modern single-page store on Laravel and React.",
    },
    description: {
      fa: "طراحی اختصاصی رابط کاربری، ترکیب Laravel و React (Inertia.js)، کاتالوگ عطرها، اتصال به درگاه شتاب و سئو تکنیکال.",
      en: "Bespoke UI, Laravel + React via Inertia.js, a perfume catalogue with rich filters, Shetab payments and technical SEO.",
    },
    highlights: {
      fa: ["SPA پرسرعت با سئوی کامل", "اتصال مستقیم به شاپرک", "فیلتر رایحه، حجم و غلظت"],
      en: ["Fast SPA with full SEO", "Direct Shaparak payments", "Filters by scent, size and strength"],
    },
    stack: ["Laravel", "React", "Inertia.js", "MySQL"],
  },
  {
    slug: "dubakala",
    year: "2024",
    category: "websites",
    status: "live",
    url: "http://dubakala.ir",
    displayUrl: "dubakala.ir",
    hue: 260,
    title: { fa: "فروشگاه دوبکالا", en: "Dubakala Store" },
    discipline: { fa: "تجارت الکترونیک", en: "E-commerce" },
    tagline: { fa: "فروشگاه جامع بر پایه ووکامرس.", en: "A full WooCommerce retail store." },
    description: {
      fa: "طراحی رابط کاربرپسند، کانفیگ ووکامرس، اتصال درگاه بانکی، بهینه‌سازی سرعت و ساختار سئو.",
      en: "Friendly storefront design, WooCommerce setup, bank gateway, speed optimisation and an SEO-first catalogue.",
    },
    highlights: {
      fa: ["پرداخت سریع و تبدیل‌محور", "نسخه موبایل اختصاصی", "پیامک ارسال سفارش"],
      en: ["Conversion-led quick checkout", "Dedicated mobile experience", "SMS order notifications"],
    },
    stack: ["WordPress", "WooCommerce", "SEO"],
  },
  {
    slug: "jonoobluxshop",
    year: "2023",
    category: "websites",
    status: "live",
    url: "http://jonoobluxshop.ir",
    displayUrl: "jonoobluxshop.ir",
    hue: 85,
    title: { fa: "جنوب لوکس شاپ", en: "Jonoob Lux Shop" },
    discipline: { fa: "بوتیک آنلاین", en: "Luxury boutique" },
    tagline: { fa: "بوتیک آنلاین شیک برای برندهای لوکس.", en: "An elegant online boutique for luxury brands." },
    description: {
      fa: "رابط مینیمال ووکامرس متناسب با کالاهای لوکس، تصاویر باکیفیت با لود سریع و سئو کلمات کلیدی.",
      en: "A minimal WooCommerce interface for luxury goods, high-resolution imagery that still loads fast, and keyword SEO.",
    },
    highlights: {
      fa: ["هویت بصری لوکس", "لود سریع تصاویر باکیفیت"],
      en: ["Luxury visual identity", "Fast high-resolution imagery"],
    },
    stack: ["WordPress", "WooCommerce", "Custom UI"],
  },
  {
    slug: "elementor-copier",
    preview: "/projects/elementor-copier.jpg",
    year: "2024",
    category: "tools",
    status: "open-source",
    url: "https://github.com/kazemcodes/Elementor-Copier",
    displayUrl: "github.com/kazemcodes",
    githubUrl: "https://github.com/kazemcodes/Elementor-Copier",
    hue: 330,
    title: { fa: "المنتور کاپیر", en: "Elementor Copier" },
    discipline: { fa: "افزونه کروم", en: "Chrome extension" },
    tagline: { fa: "انتقال آنی سکشن‌های المنتور میان سایت‌ها.", en: "Copy Elementor sections across sites instantly." },
    description: {
      fa: "ابزار مرورگر برای کپی مستقیم سکشن‌های المنتور بین دامنه‌ها بدون فایل خروجی.",
      en: "A browser tool that copies Elementor sections between domains directly, with no export files.",
    },
    highlights: {
      fa: ["کپی ساختار، استایل و تصاویر", "صرفه‌جویی ساعت‌ها کار"],
      en: ["Copies structure, styles and images", "Saves designers hours"],
    },
    stack: ["JavaScript", "Chrome API", "Elementor"],
  },
  {
    slug: "gradle-mirror",
    preview: "/projects/gradle-mirror.jpg",
    year: "2024",
    category: "tools",
    status: "open-source",
    url: "https://github.com/kazemcodes/gradle-mirror-cloudflare-worker",
    displayUrl: "workers.cloudflare.com",
    githubUrl: "https://github.com/kazemcodes/gradle-mirror-cloudflare-worker",
    hue: 200,
    title: { fa: "میرور گریدل برای ایران", en: "Gradle Mirror for Iran" },
    discipline: { fa: "زیرساخت سرورلس", en: "Serverless infrastructure" },
    tagline: { fa: "پروکسی لبه برای وابستگی‌های گریدل و ماون.", en: "An edge proxy for Gradle and Maven dependencies." },
    description: {
      fa: "پروکسی لبه شبکه با کلودفلر ورکرز برای دریافت پرسرعت پیش‌نیازهای توسعه در ایران.",
      en: "An edge proxy on Cloudflare Workers that gives developers in Iran fast, reliable dependency downloads.",
    },
    highlights: {
      fa: ["توزیع در لبه شبکه", "حل اختلال دانلود کتابخانه‌ها"],
      en: ["Distributed at the edge", "Fixes blocked library downloads"],
    },
    stack: ["Cloudflare Workers", "JavaScript", "PHP"],
  },
  {
    slug: "skill-tree",
    preview: "/projects/skill-tree.jpg",
    year: "2025",
    category: "tools",
    status: "open-source",
    url: "https://github.com/kazemcodes/skill-tree",
    displayUrl: "github.com/kazemcodes/skill-tree",
    githubUrl: "https://github.com/kazemcodes/skill-tree",
    hue: 120,
    title: { fa: "درخت مهارت هوش مصنوعی", en: "AI Skill Tree" },
    discipline: { fa: "مهندسی هوش مصنوعی", en: "AI engineering" },
    tagline: { fa: "بیش از ۱۰۰ مهارت استاندارد برای ایجنت‌های کدنویس.", en: "100+ standard skills for coding agents." },
    description: {
      fa: "پروتکل‌ها و مهارت‌های عامل‌محور شامل Clean Architecture، TDD، سئو و بازبینی خودکار کد.",
      en: "Agent protocols and skills covering clean architecture, TDD, SEO and automated code review.",
    },
    highlights: {
      fa: ["۱۰۰+ مهارت مهندسی", "سازگار با فریم‌ورک‌های ایجنت"],
      en: ["100+ engineering skills", "Works with modern agent frameworks"],
    },
    stack: ["AI Agents", "Python", "Automation"],
  },
  {
    slug: "kafshpakucholo",
    preview: "/projects/kafshpakucholo.jpg",
    year: "2026",
    category: "websites",
    status: "live",
    featured: true,
    url: "https://kafshpakucholo.ir/",
    displayUrl: "kafshpakucholo.ir",
    hue: 20,
    title: { fa: "کفش پاکوچولو", en: "Pa Kucholo Kids Shoes" },
    discipline: { fa: "فروشگاه اینترنتی", en: "E-commerce" },
    tagline: { fa: "فروشگاه تخصصی کفش و کتونی بچگانه.", en: "A specialist online store for kids' shoes." },
    description: {
      fa: "فروشگاه کفش‌های اسکیت، چراغ‌دار و بندپیچی وارداتی با استوری‌های ویدیویی محصول، ضمانت تعویض سایز و ارسال سریع.",
      en: "Imported skate, LED and twist-lace kids' shoes with video product stories, size-exchange guarantee and fast shipping.",
    },
    highlights: {
      fa: ["استوری ویدیویی محصولات", "ضمانت تعویض سایز تا ۷ روز"],
      en: ["Video product stories", "7-day size exchange"],
    },
    stack: ["Laravel", "E-commerce", "SEO"],
  },
  {
    slug: "foolazhths",
    preview: "/projects/foolazhths.jpg",
    year: "2026",
    category: "websites",
    status: "live",
    featured: true,
    url: "https://foolazhths.ir/",
    displayUrl: "foolazhths.ir",
    hue: 230,
    title: { fa: "هنرستان فرهنگ فولاژ", en: "Farhang Foolazh Technical School" },
    discipline: { fa: "سامانه آموزشی", en: "Education platform" },
    tagline: { fa: "نخستین هنرستان صنعت‌محور غیرانتفاعی کشور.", en: "The first industry-led charitable technical school." },
    description: {
      fa: "پرتال هنرستان‌ها و رشته‌های فنی فولاژ با معرفی رشته‌ها، ثبت‌نام آنلاین و سایت جداگانه برای هر هنرستان.",
      en: "Portal for Foolazh's technical schools and majors, with online enrolment and a dedicated site per school.",
    },
    highlights: {
      fa: ["چند هنرستان در یک سامانه", "ثبت‌نام آنلاین"],
      en: ["Multiple schools, one platform", "Online enrolment"],
    },
    stack: ["Laravel", "Multi-site", "Education"],
  },
  {
    slug: "ireader",
    preview: "/projects/ireader.jpg",
    year: "2024",
    category: "apps",
    status: "open-source",
    featured: true,
    url: "https://github.com/kazemcodes/IReader",
    displayUrl: "github.com/kazemcodes/IReader",
    githubUrl: "https://github.com/kazemcodes/IReader",
    hue: 260,
    title: { fa: "آی‌ریدر", en: "IReader" },
    discipline: { fa: "اپلیکیشن اندروید", en: "Android app" },
    tagline: { fa: "رمان‌خوان رایگان و متن‌باز برای اندروید.", en: "A free, open-source novel reader for Android." },
    description: {
      fa: "کتابخانه، منابع افزونه‌ای، خواندن با تم‌های دلخواه، تبدیل متن به گفتار و ترجمه — ساخته‌شده با Kotlin و Jetpack Compose.",
      en: "Library, extension sources, themed reader, text-to-speech and translation — built with Kotlin and Jetpack Compose.",
    },
    highlights: {
      fa: ["تبدیل متن به گفتار و ترجمه", "سیستم افزونه‌های منابع"],
      en: ["Text-to-speech and translation", "Extension source system"],
    },
    stack: ["Kotlin", "Jetpack Compose", "Android"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProjects = () => projects.filter((p) => p.featured);
