export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  comment: string;
  rating: number;
  projectUrl?: string;
  verified: boolean;
}

export const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'مدیریت مجموعه هنرستان‌های فرانو و فرهنگ ماهان',
    role: 'مدیر مجتمع آموزشی',
    company: 'هنرستان‌های کشاورزی و صنعتی هرمزگان',
    comment: 'سامانه Farmahan.ir هزینه‌های گزاف نرم‌افزارهای مدرسه را برای ما از بین برد. سیستم بسیار سبک، سریع و هماهنگ با نیازهای مدارس فنی و دانش‌آموزان است و پشتیبانی فنی استودیو مریدی همواره عالی و در دسترس بوده است.',
    rating: 5,
    projectUrl: 'https://farmahan.ir',
    verified: true
  },
  {
    id: '2',
    name: 'مدیریت فروشگاه آنلاین کالا خش',
    role: 'مالک و مدیر فروشگاه',
    company: 'فروشگاه تخصصی عطر و ادکلن Kalakhash.ir',
    comment: 'سرعت سایت برای ما حیاتی بود. پیاده‌سازی با فریم‌ورک لاراول و ریکت باعث شد سرعت باز شدن صفحات و ثبت سفارش فوق‌العاده باشد و کاربران تجربه خریدی بدون معطلی و قطعی داشته باشند.',
    rating: 5,
    projectUrl: 'http://kalakhash.ir',
    verified: true
  },
  {
    id: '3',
    name: 'تیم پشتیبانی دوبکالا',
    role: 'مدیر مارکتینگ و فروش',
    company: 'فروشگاه اینترنتی Dubakala.ir',
    comment: 'طراحی کاربرپسند و هماهنگ با موبایل فروشگاه ما توسط استودیو مریدی باعث افزایش محسوس نرخ تبدیل و کاهش سبدهای خرید رهاشده شد. تنظیمات درگاه بانکی و پیامک‌ها نیز بدون کوچک‌ترین خطایی کار می‌کنند.',
    rating: 5,
    projectUrl: 'http://dubakala.ir',
    verified: true
  }
];
