<script lang="ts">
  import { contactData } from '../data/contacts';
</script>

<footer class="footer-wrapper">
  <div class="container">
    <div class="footer-main-grid">
      <!-- Brand Column -->
      <div class="footer-col brand-col">
        <div class="f-brand-logo">
          <span class="f-logo-text">KM Studio</span>
        </div>
        <p class="f-brand-desc">
          استودیو تخصصی طراحی و توسعه وب‌سایت‌ها، فروشگاه‌های آنلاین استاندارد و پلتفرم‌های ابری اختصاصی. متعهد به بالاترین کیفیت مهندسی نرم‌افزار، سرعت بارگذاری استثنایی و پشتیبانی مستمر.
        </p>
      </div>

      <!-- Quick Links -->
      <div class="footer-col">
        <h4 class="f-col-title">دسترسی سریع</h4>
        <div class="f-links">
          <a href="#hero">صفحه اصلی</a>
          <a href="#services">خدمات ما</a>
          <a href="#projects">پروژه‌های شاخص</a>
          <a href="#calculator">محاسبه هزینه</a>
          <a href="#contact">تماس و ثبت سفارش</a>
        </div>
      </div>

      <!-- Services -->
      <div class="footer-col">
        <h4 class="f-col-title">خدمات تخصصی</h4>
        <div class="f-links">
          <a href="#services">طراحی فروشگاه اینترنتی</a>
          <a href="#services">سامانه‌های اختصاصی لاراول</a>
          <a href="#services">طراحی رابط کاربری UI/UX</a>
          <a href="#services">بهینه‌سازی سرعت و سئو</a>
          <a href="#services">اپلیکیشن‌های موبایل فلاتر</a>
          <a href="#services">استقرار اقتصادی سرور</a>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="footer-col">
        <h4 class="f-col-title">راه‌های ارتباطی</h4>
        <div class="f-contact-list">
          <div class="f-contact-item">
            <span>تلفن تماس:</span>
            <a href={`tel:${contactData.phone}`} class="f-phone-link">
              <bdi dir="ltr">{contactData.phoneDisplay}</bdi>
            </a>
          </div>
          <div class="f-contact-item">
            <span>پیام‌رسان بله:</span>
            <a href={contactData.bale} target="_blank" rel="noopener noreferrer" class="f-bale-link">
              {contactData.baleUsername} (Bale) ↗
            </a>
          </div>
          <div class="f-contact-item">
            <span>ایمیل:</span>
            <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
          </div>
          <div class="f-contact-item">
            <span>پاسخگویی:</span>
            <span>{contactData.workingHours}</span>
          </div>
          <div class="f-contact-item">
            <span>موقعیت:</span>
            <span>هرمزگان، ایران</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom-bar">
      <p class="copyright-text">
        © ۱۴۰۴ استودیو مریدی. تمامی حقوق محفوظ است.
      </p>
      <div class="f-socials">
        <a href={contactData.bale} target="_blank" rel="noopener noreferrer" class="bale-highlight">بله (Bale)</a>
        <a href={contactData.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
        <a href={contactData.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={contactData.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <a href="#hero" class="back-to-top" aria-label="بازگشت به بالا">
        <span class="arrow-up-icon"></span>
      </a>
    </div>
  </div>
</footer>

<style>
  .footer-wrapper {
    background: #0f172a;
    color: #ffffff;
    padding: 80px 0 32px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .footer-main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
    margin-bottom: 64px;
  }

  @media (min-width: 640px) {
    .footer-main-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .footer-main-grid {
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 40px;
    }
  }

  .brand-col {
    padding-left: 24px;
  }

  .f-brand-logo {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  .f-logo-text {
    font-size: 1.5rem;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 1px;
  }

  .f-brand-desc {
    font-size: 0.9375rem;
    color: #94a3b8;
    line-height: 1.8;
    margin: 0;
  }

  .f-col-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 24px 0;
  }

  .f-links {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .f-links a {
    font-size: 0.9375rem;
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .f-links a:hover {
    color: #38bdf8;
  }

  .f-contact-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .f-contact-item {
    font-size: 0.9375rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: #94a3b8;
  }

  .f-contact-item a {
    color: #38bdf8;
    text-decoration: none;
    font-weight: 600;
    font-family: inherit;
    display: inline-block;
  }

  .f-phone-link {
    letter-spacing: 0.5px;
    unicode-bidi: isolate;
  }

  .f-bale-link {
    color: #4ade80 !important;
  }

  .bale-highlight {
    color: #4ade80 !important;
  }

  .f-contact-item a:hover {
    color: #7dd3fc;
  }

  .footer-bottom-bar {
    padding-top: 32px;
    border-top: 1px solid #1e293b;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
  }

  @media (min-width: 768px) {
    .footer-bottom-bar {
      flex-direction: row;
    }
  }

  .copyright-text {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  .f-socials {
    display: flex;
    gap: 24px;
  }

  .f-socials a {
    font-size: 0.875rem;
    font-weight: 600;
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .f-socials a:hover {
    color: #ffffff;
  }

  .back-to-top {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #1e293b;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: background-color 0.2s ease;
  }

  .back-to-top:hover {
    background-color: #334155;
  }

  .arrow-up-icon {
    width: 10px;
    height: 10px;
    border-top: 2px solid #94a3b8;
    border-right: 2px solid #94a3b8;
    transform: rotate(-45deg) translate(2px, 2px);
  }
</style>
