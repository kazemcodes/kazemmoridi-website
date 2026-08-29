export interface Project {
  id: string;
  title: string;
  category: 'websites' | 'apps' | 'tools';
  categoryLabel: string;
  tagline: string;
  description: string;
  url: string;
  displayUrl: string;
  status: 'live' | 'deploying' | 'open-source';
  statusLabel: string;
  roleBadge: string;
  highlights: string[];
  techStack: string[];
  featured?: boolean;
  previewAvailable?: boolean;
  previewSnapshotUrl?: string; // fallback if iframe is blocked by X-Frame-Options
  githubUrl?: string;
  stats?: { label: string; value: string }[];
}

export const projectsData: Project[] = [
  {
    id: 'farmahan',
    title: 'سامانه مدیریت مدارس فرهنگ ماهان',
    category: 'websites',
    categoryLabel: 'سامانه ابری و فناوری آموزشی',
    tagline: 'پلتفرم یکپارچه مدیریت مدارس، آزمون‌ساز آنلاین، ثبت‌نام و رهگیری ویدیوهای آموزشی',
    description: 'سامانه جامع و سبک که با معماری اختصاصی Laravel 13 و Svelte 5 پیاده‌سازی شده است. این سامانه نیاز به نرم‌افزارهای سنگین و گران‌قیمت را از میان برداشته و با استقرار کم‌هزینه روی هاست‌های اشتراکی، هم‌اکنون ۵ هنرستان کشاورزی و صنعتی را پشتیبانی می‌کند.',
    url: 'https://farmahan.ir',
    displayUrl: 'farmahan.ir',
    status: 'live',
    statusLabel: 'فعال و آنلاین',
    roleBadge: '👑 معمار ارشد و فول‌استک',
    highlights: [
      'مدیریت ۵ هنرستان کشاورزی و صنعتی فعال در هرمزگان',
      'معماری فوق سریع Laravel 13 + Svelte 5 + Filament',
      'تقویم جلالی بومی، آزمون‌ساز آنلاین و پنل دانش‌آموزی',
      'کاهش ۹۰ درصدی هزینه‌های سرور با کش بهینه'
    ],
    techStack: ['Laravel 13', 'Svelte 5', 'Filament Admin', 'Inertia.js', 'MySQL', 'Persian RTL'],
    featured: true,
    previewAvailable: true,
    stats: [
      { label: 'مدارس تحت پوشش', value: '۵ هنرستان' },
      { label: 'میانگین لود', value: '۱٫۲ ثانیه' },
      { label: 'آپ‌تایم', value: '۹۹٫۹٪' }
    ]
  },
  {
    id: 'icount',
    title: 'سامانه هوشمند حسابداری و پوز آی‌کنت (iCount)',
    category: 'apps',
    categoryLabel: 'نرم‌افزار ابری حسابداری و POS',
    tagline: 'نرم‌افزار ابری حسابداری، انبارداری و صندوق فروشگاهی چندپلتفرمی با فلاتر',
    description: 'سامانه ابری و چندپلتفرمی حسابداری فروشگاهی برای مدیریت موجودی انبار، صدور آنی فاکتور با پرینتر حرارتی، گزارش‌گیری سود و زیان و همگام‌سازی لحظه‌ای میان شعب و دستگاه‌ها.',
    url: 'https://icount.ir',
    displayUrl: 'icount.ir',
    status: 'deploying',
    statusLabel: 'آماده‌سازی استقرار',
    roleBadge: '🚀 بنیان‌گذار و توسعه‌دهنده',
    highlights: [
      'اجرای یکپارچه روی ویندوز، مک، اندروید و تبلت',
      'ثبت فاکتور زیر ۵ ثانیه با اتصال به پوز بانکی',
      'مدیریت چند انبار و کنترل سطوح دسترسی کارکنان'
    ],
    techStack: ['Flutter', 'Dart', 'SaaS Architecture', 'REST API', 'POS Terminal'],
    featured: true,
    previewAvailable: true,
    stats: [
      { label: 'پلتفرم‌ها', value: 'دسکتاپ + موبایل' },
      { label: 'سرعت صدور', value: 'آنلاین و آنی' }
    ]
  },
  {
    id: 'kalakhash',
    title: 'فروشگاه اینترنتی کالا خش (Kalakhash.ir)',
    category: 'websites',
    categoryLabel: 'فروشگاه آنلاین عطر و ادکلن',
    tagline: 'فروشگاه مدرن SPA ساخته‌شده با فریم‌ورک‌های قدرتمند لاراول و ریکت',
    description: 'طراحی اختصاصی رابط کاربری، کدنویسی فروشگاهی با ترکیب پیشرفته Laravel و React (Inertia.js)، مدیریت کاتالوگ عطرها، اتصال به درگاه پرداخت اینترنتی شتاب و بهینه‌سازی فنی سئو.',
    url: 'http://kalakhash.ir',
    displayUrl: 'kalakhash.ir',
    status: 'live',
    statusLabel: 'فروشگاه فعال',
    roleBadge: '🛍️ فروشگاه آنلاین سفارشی',
    highlights: [
      'سرعت بالای Single Page Application با سئوی کامل',
      'اتصال مستقیم به درگاه پرداخت بانکی شاپرک',
      'فیلترهای پیشرفته رایحه، حجم و غلظت عطر'
    ],
    techStack: ['Laravel', 'React', 'Inertia.js', 'PHP', 'MySQL', 'سئو تکنیکال'],
    featured: true,
    previewAvailable: true
  },
  {
    id: 'dubakala',
    title: 'فروشگاه آنلاین دوبکالا (Dubakala.ir)',
    category: 'websites',
    categoryLabel: 'فروشگاه تجارت الکترونیک کالا و مد',
    tagline: 'فروشگاه جامع تجارت الکترونیک بر پایه وردپرس و ووکامرس',
    description: 'طراحی و پیاده‌سازی کامل فروشگاه آنلاین، از طراحی رابط کاربری کاربرپسند تا کانفیگ ووکامرس، اتصال درگاه بانکی، بهینه‌سازی سرعت و تدوین ساختار دسته‌بندی و سئو.',
    url: 'http://dubakala.ir',
    displayUrl: 'dubakala.ir',
    status: 'live',
    statusLabel: 'فروشگاه فعال',
    roleBadge: '🛍️ طراحی و راه‌اندازی کامل',
    highlights: [
      'طراحی تبدیل‌محور با تجربه پرداخت سریع',
      'بهینه‌سازی ریسپانسیو اختصاصی برای کاربران موبایل',
      'اتصال پیامک اطلاع‌رسانی ارسال سفارش'
    ],
    techStack: ['WordPress', 'WooCommerce', 'UI/UX Design', 'SEO', 'درگاه پرداخت'],
    previewAvailable: true
  },
  {
    id: 'jonoobluxshop',
    title: 'فروشگاه آنلاین جنوب لوکس شاپ (Jonoobluxshop.ir)',
    category: 'websites',
    categoryLabel: 'بوتیک آنلاین کالاهای لوکس',
    tagline: 'فروشگاه آنلاین شیک و پرسرعت برای عرضه محصولات و پوشاک برند',
    description: 'طراحی رابط کاربری شکیل و مینیمال ووکامرس متناسب با ماهیت کالاهای برند و لوکس، بهینه‌سازی تصاویر با وضوح بالا، افزایش سرعت بارگذاری و سئو کلمات کلیدی.',
    url: 'http://jonoobluxshop.ir',
    displayUrl: 'jonoobluxshop.ir',
    status: 'live',
    statusLabel: 'فروشگاه فعال',
    roleBadge: '🛍️ طراحی لوکس و بهینه‌سازی',
    highlights: [
      'هویت بصری لوکس متناسب با برندهای معتبر',
      'لود سریع تصاویر باکیفیت و رزولوشن بالا'
    ],
    techStack: ['WordPress', 'WooCommerce', 'Custom UI', 'SEO'],
    previewAvailable: true
  },
  {
    id: 'elementor-copier',
    title: 'افزونه المنتور کپی‌یر (Elementor Copier)',
    category: 'tools',
    categoryLabel: 'ابزار توسعه‌دهندگان وردپرس',
    tagline: 'کپی و انتقال آنی سکشن‌ها و المان‌های المنتور میان وب‌سایت‌های مختلف',
    description: 'ابزار کمکی مرورگر کروم جهت افزایش چندبرابری سرعت توسعه وب‌سایت‌های وردپرسی با امکان کپی مستقیم سکشن‌های المنتور بین دامنه‌های جداگانه بدون نیاز به ساخت فایل خروجی.',
    url: 'https://github.com/kazemcodes/Elementor-Copier',
    displayUrl: 'github.com/kazemcodes/Elementor-Copier',
    status: 'open-source',
    statusLabel: '🛠️ ابزار توسعه',
    roleBadge: '⚙️ افزونه کروم اختصاصی',
    highlights: [
      'کپی آنی ساختار سکشن، استایل‌ها و تصاویر',
      'صرفه‌جویی در ساعت‌ها کار طراحان وب'
    ],
    techStack: ['JavaScript', 'Chrome Extension API', 'WordPress', 'Elementor'],
    githubUrl: 'https://github.com/kazemcodes/Elementor-Copier'
  },
  {
    id: 'gradle-mirror',
    title: 'پروکسی و میرور گریدل برای ایران',
    category: 'tools',
    categoryLabel: 'زیرساخت ابری و سرورلس',
    tagline: 'سرویس پروکسی با دسترس‌پذیری بالا برای دانلود وابستگی‌های گریدل و ماون',
    description: 'طراحی و پیاده‌سازی زیرساخت پروکسی لبه شبکه (Edge Proxy) با ورکرز کلودفلر و PHP جهت دور زدن تحریم‌ها و دریافت پرسرعت پیش‌نیازهای توسعه نرم‌افزار در ایران.',
    url: 'https://github.com/kazemcodes/gradle-mirror-cloudflare-worker',
    displayUrl: 'workers.cloudflare.com',
    status: 'open-source',
    statusLabel: '🛠️ زیرساخت ابری',
    roleBadge: '⚙️ مهندس زیرساخت',
    highlights: [
      'توزیع در لبه شبکه با کلودفلر ورکرز',
      'حل اختلالات دانلود کتابخانه‌های اندروید'
    ],
    techStack: ['JavaScript', 'Cloudflare Workers', 'PHP', 'Serverless'],
    githubUrl: 'https://github.com/kazemcodes/gradle-mirror-cloudflare-worker'
  },
  {
    id: 'skill-tree',
    title: 'درخت مهارت‌های هوش مصنوعی (Skill Tree)',
    category: 'tools',
    categoryLabel: 'اکوسیستم هوش مصنوعی عامل‌محور',
    tagline: 'مجموعه ۱۰۰+ مهارت استاندارد برای هوش‌های مصنوعی عامل‌محور و کدنویسی خودکار',
    description: 'طراحی پروتکل‌ها و مهارت‌های عامل‌محور شامل Clean Architecture، TDD، سئو پیشرفته و بازبینی خودکار کدهای مهندسی نرم‌افزار برای دستیاران هوشمند.',
    url: 'https://github.com/kazemcodes/skill-tree',
    displayUrl: 'github.com/kazemcodes/skill-tree',
    status: 'open-source',
    statusLabel: '🤖 مهندسی AI',
    roleBadge: '🤖 معمار مهارت‌های AI',
    highlights: [
      'بیش از ۱۰۰ مهارت مهندسی نرم‌افزار',
      'سازگار با تمام Agent Frameworkهای نوین'
    ],
    techStack: ['AI Agents', 'Prompt Engineering', 'Python', 'Automation'],
    githubUrl: 'https://github.com/kazemcodes/skill-tree'
  }
];
