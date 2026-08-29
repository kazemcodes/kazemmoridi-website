export interface PipelineItem {
  id: string;
  title: string;
  subtitle: string;
  stage: 'active-dev' | 'beta-stage' | 'next-gen';
  stageLabel: string;
  stageColor: string;
  description: string;
  progressPercent: number;
  features: string[];
  techStack: string[];
  targetLaunch: string;
}

export const pipelineData: PipelineItem[] = [
  {
    id: 'icount-cloud',
    title: 'iCount.ir — پلتفرم ابری مالی و صندوق فروشگاهی',
    subtitle: 'نسل جدید حسابداری و انبارداری متصل به پایانه فروش برای اصناف و فروشگاه‌ها',
    stage: 'active-dev',
    stageLabel: 'در حال توسعه فعال',
    stageColor: '#d97706',
    description: 'یک نرم‌افزار چندپلتفرمی با رابط کاربری مینیمال بر پایه فلاتر و دیتابیس ابری با همگام‌سازی آفلاین/آنلاین. مناسب برای خرده‌فروشی‌ها، عمده‌فروشی‌ها و فروشگاه‌های زنجیره‌ای بدون نیاز به سیستم‌های سخت‌افزاری گران‌قیمت.',
    progressPercent: 85,
    features: [
      'همگام‌سازی ابری و کارکرد آفلاین',
      'اتصال به کارت‌خوان، بارکدخوان و فیش‌پرینتر',
      'گزارش‌گیری مالیاتی و سود و زیان لحظه‌ای',
      'اپلیکیشن اختصاصی موبایل برای مدیران'
    ],
    techStack: ['Flutter', 'Dart', 'SaaS', 'Offline-First DB', 'REST API'],
    targetLaunch: 'بهار ۱۴۰۵'
  },
  {
    id: 'farmahan-exam',
    title: 'موتور هوشمند آزمون‌ساز و ویدیوی تعاملی Farmahan',
    subtitle: 'ماژول سنجش آنلاین و نظارت بر یادگیری ویدیویی دانش‌آموزان مدارس فنی',
    stage: 'beta-stage',
    stageLabel: 'مرحله بتا و تست در مدارس',
    stageColor: '#0284c7',
    description: 'سیستم آزمون آنلاین با امکان طراحی سوالات چهارگزینه‌ای، تشریحی و محاسباتی به همراه تصحیح آنی، رهگیری دقیق مدت زمان تماشای ویدیوهای درسی و تحلیل نقاط ضعف درسی دانش‌آموزان.',
    progressPercent: 92,
    features: [
      'تصحیح خودکار و صدور آنی کارنامه تحلیلی',
      'ردیابی پیشرفت و جلوگیری از رد کردن ویدیوهای آموزشی',
      'پشتیبانی از فرمول‌های ریاضی و اشکال هندسی',
      'ارسال پیامک نمرات به اولیا'
    ],
    techStack: ['Laravel 13', 'Svelte 5', 'Interactive Video Player', 'Filament'],
    targetLaunch: 'زمستان ۱۴۰۴'
  },
  {
    id: 'eco-hosting',
    title: 'معماری وب سبک و فوق اقتصادی برای سرورهای ایران',
    subtitle: 'کیت توسعه اختصاصی با حداکثر بهره‌وری و استقرار ارزان روی هاست اشتراکی',
    stage: 'next-gen',
    stageLabel: 'معماری نسل جدید',
    stageColor: '#059669',
    description: 'فریم‌ورک استقرار بهینه‌سازی‌شده برای وب‌سایت‌های تجاری ایرانی که امکان پردازش همزمان صدها درخواست را با مصرف کمتر از ۱۲۸ مگابایت رم فراهم می‌کند تا کسب‌وکارها نیازی به هزینه‌های گزاف سرور اختصاصی نداشته باشند.',
    progressPercent: 78,
    features: [
      'پاسخ‌دهی زیر ۱۰۰ میلی‌ثانیه در لبه شبکه',
      'بهینه‌سازی پایگاه‌داده با ایندکس‌گذاری هوشمند',
      'بدون نیاز به سرور مجازی گران‌قیمت',
      'پشتیبانی کامل از کش چندلایه و SSR'
    ],
    techStack: ['PHP 8.4+', 'Svelte SSR', 'SQLite / MySQL Tuning', 'Edge Caching'],
    targetLaunch: 'بهار ۱۴۰۵'
  }
];
