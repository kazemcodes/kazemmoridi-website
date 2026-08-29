<script lang="ts">
  import { onMount } from 'svelte';
  import { contactData } from '../data/contacts';

  let formName = '';
  let formPhone = '';
  let formService = '';
  let formMessage = '';
  let formSubmitted = false;
  let formEl: HTMLElement | null = null;

  function parseHashOrSearch() {
    if (typeof window === 'undefined') return;
    
    // Check hash query params e.g. #contact?msg=... or #contact-section?msg=...
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const queryString = hash.split('?')[1];
      const params = new URLSearchParams(queryString);
      const msg = params.get('msg');
      const service = params.get('service');
      if (msg) formMessage = decodeURIComponent(msg);
      if (service) formService = service;
    }

    // Also check standard search params
    const searchParams = new URLSearchParams(window.location.search);
    const sMsg = searchParams.get('msg');
    const sService = searchParams.get('service');
    if (sMsg) formMessage = decodeURIComponent(sMsg);
    if (sService) formService = sService;
  }

  onMount(() => {
    parseHashOrSearch();

    const handleHashChange = () => {
      parseHashOrSearch();
    };

    const handleCustomPrefill = (e: any) => {
      if (e.detail?.message) formMessage = e.detail.message;
      if (e.detail?.service) formService = e.detail.service;
      const targetEl = document.getElementById('contact');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('prefill-quote', handleCustomPrefill);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('prefill-quote', handleCustomPrefill);
    };
  });

  function handleSubmit() {
    formSubmitted = true;

    // Construct text for messenger
    const serviceName = formService || 'سفارش عمومی وب‌سایت';
    const text = `سلام، درخواست جدید از سایت KM Studio:\n👤 نام: ${formName}\n📞 شماره تماس: ${formPhone}\n🛠️ سرویس: ${serviceName}\n📝 توضیحات: ${formMessage}`;

    // Auto-open Bale with prefilled text
    const baleUrl = `https://ble.ir/kazem_moridi?text=${encodeURIComponent(text)}`;
    window.open(baleUrl, '_blank');
  }
</script>

<section id="contact" class="contact-section">
  <div class="container" id="contact-section">
    <div class="section-header">
      <h2 class="section-title">تماس و ثبت سفارش</h2>
      <p class="section-subtitle">برای مشاوره رایگان، استعلام قیمت و شروع همکاری با ما در ارتباط باشید</p>
    </div>

    <div class="contact-layout">
      <!-- Contact Channels -->
      <div class="contact-channels">
        <!-- Bale Messenger (Primary) -->
        <a href={contactData.bale} target="_blank" rel="noopener noreferrer" class="channel-card bale-card">
          <div class="channel-dot bale-dot"></div>
          <div class="channel-info">
            <div class="channel-badge">پیام‌رسان اصلی</div>
            <h4 class="channel-title">پیام‌رسان بله (Bale)</h4>
            <div class="channel-value" dir="ltr">{contactData.baleUsername}</div>
            <span class="channel-hint">ارسال آنی پیام و ثبت سریع سفارش</span>
          </div>
        </a>

        <!-- Phone Direct -->
        <a href={`tel:${contactData.phone}`} class="channel-card phone-card">
          <div class="channel-dot phone-dot"></div>
          <div class="channel-info">
            <h4 class="channel-title">تماس تلفنی مستقیم</h4>
            <div class="channel-value phone-val" dir="ltr">
              <bdi dir="ltr">{contactData.phoneDisplay}</bdi>
            </div>
            <span class="channel-hint">شنبه تا پنج‌شنبه ۹ الی ۲۱</span>
          </div>
        </a>

        <!-- Telegram -->
        <a href={contactData.telegram} target="_blank" rel="noopener noreferrer" class="channel-card telegram-card">
          <div class="channel-dot telegram-dot"></div>
          <div class="channel-info">
            <h4 class="channel-title">تلگرام (Telegram)</h4>
            <div class="channel-value" dir="ltr">{contactData.telegramUsername}</div>
            <span class="channel-hint">مشاوره آنلاین و ارسال مستندات</span>
          </div>
        </a>

        <!-- WhatsApp -->
        <a href={contactData.whatsapp} target="_blank" rel="noopener noreferrer" class="channel-card whatsapp-card">
          <div class="channel-dot whatsapp-dot"></div>
          <div class="channel-info">
            <h4 class="channel-title">واتس‌اپ (WhatsApp)</h4>
            <div class="channel-value phone-val" dir="ltr">
              <bdi dir="ltr">{contactData.phoneDisplay}</bdi>
            </div>
          </div>
        </a>

        <!-- Email -->
        <a href={`mailto:${contactData.email}`} class="channel-card email-card">
          <div class="channel-dot email-dot"></div>
          <div class="channel-info">
            <h4 class="channel-title">ایمیل رسمی</h4>
            <div class="channel-value email-val">{contactData.email}</div>
          </div>
        </a>

        <div class="location-text">
          موقعیت استودیو: {contactData.location}
        </div>
      </div>

      <!-- Contact Form -->
      <div class="contact-form-wrapper" bind:this={formEl}>
        {#if formSubmitted}
          <div class="success-message">
            <div class="success-icon"></div>
            <h3>درخواست شما با موفقیت ثبت شد!</h3>
            <p>در حال انتقال به پیام‌رسان بله برای ارتباط مستقیم هستیم. در صورت عدم انتقال، می‌توانید از دکمه‌های زیر استفاده کنید:</p>
            <div class="success-actions">
              <a href={contactData.bale} target="_blank" rel="noopener noreferrer" class="btn-success-bale">
                ورود به چت در بله (Bale)
              </a>
              <button class="btn-reset" on:click={() => (formSubmitted = false)}>
                ثبت پیام جدید
              </button>
            </div>
          </div>
        {:else}
          <form class="contact-form" on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
              <label for="name">نام و نام خانوادگی یا نام شرکت *</label>
              <input 
                type="text" 
                id="name" 
                bind:value={formName} 
                required 
                class="form-control" 
                placeholder="مثال: علی احمدی (شرکت سپهر)"
              />
            </div>

            <div class="form-group">
              <label for="phone">شماره تماس مستقیم *</label>
              <input 
                type="tel" 
                id="phone" 
                bind:value={formPhone} 
                required 
                class="form-control phone-input" 
                dir="ltr" 
                placeholder="0917 123 4567"
              />
            </div>

            <div class="form-group">
              <label for="service">نوع خدمات مورد نیاز</label>
              <select id="service" bind:value={formService} class="form-control">
                <option value="">انتخاب نوع پروژه...</option>
                <option value="ecommerce">طراحی فروشگاه اینترنتی آنلاین</option>
                <option value="laravel">سامانه یا پلتفرم اختصاصی لاراول / Svelte</option>
                <option value="corporate">وب‌سایت شرکتی و معرفی برند</option>
                <option value="uiux">طراحی رابط و تجربه کاربری (UI/UX)</option>
                <option value="seo">بهینه‌سازی سرعت و سئو تکنیکال</option>
                <option value="mobile">اپلیکیشن موبایل و چندپلتفرمی فلاتر</option>
                <option value="other">سایر موارد و مشاوره اختصاصی</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">توضیحات و جزئیات پروژه</label>
              <textarea 
                id="message" 
                bind:value={formMessage} 
                rows="4" 
                class="form-control" 
                placeholder="توضیحات مورد نظر، امکانات لازم یا پیام برآورد قیمت..."
              ></textarea>
            </div>

            <button type="submit" class="submit-btn">
              <span>ثبت درخواست و ارسال به پیام‌رسان بله (Bale) ↗</span>
            </button>
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .contact-section {
    padding: 100px 0;
    background-color: #fafbfc;
    direction: rtl;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 12px 0;
  }

  .section-subtitle {
    font-size: 1rem;
    color: #64748b;
    margin: 0;
  }

  .contact-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
  }

  @media (min-width: 992px) {
    .contact-layout {
      grid-template-columns: 1fr 1.4fr;
      gap: 56px;
    }
  }

  .contact-channels {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .channel-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #ffffff;
    padding: 20px 24px;
    border-radius: 16px;
    text-decoration: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border-right: 4px solid transparent;
    transition: all 0.2s ease;
    position: relative;
  }

  .channel-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }

  .bale-card { 
    border-right-color: #059669; 
    background: #f0fdf4;
  }
  .phone-card { border-right-color: #1e40af; }
  .telegram-card { border-right-color: #0ea5e9; }
  .whatsapp-card { border-right-color: #10b981; }
  .email-card { border-right-color: #6366f1; }

  .channel-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .bale-dot { background-color: #059669; }
  .phone-dot { background-color: #1e40af; }
  .telegram-dot { background-color: #0ea5e9; }
  .whatsapp-dot { background-color: #10b981; }
  .email-dot { background-color: #6366f1; }

  .channel-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }

  .channel-badge {
    align-self: flex-start;
    font-size: 11px;
    font-weight: 700;
    color: #059669;
    background: #dcfce7;
    padding: 2px 8px;
    border-radius: 9999px;
    margin-bottom: 2px;
  }

  .channel-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    margin: 0;
  }

  .channel-value {
    font-size: 1.0625rem;
    font-weight: 700;
    color: #1e293b;
    text-align: right;
  }

  .phone-val {
    font-family: inherit;
    letter-spacing: 0.5px;
    unicode-bidi: isolate;
  }

  .email-val {
    font-family: monospace;
    font-size: 0.95rem;
  }

  .channel-hint {
    font-size: 12px;
    color: #94a3b8;
  }

  .location-text {
    margin-top: 12px;
    font-size: 0.875rem;
    color: #64748b;
    padding: 0 8px;
    line-height: 1.6;
  }

  .contact-form-wrapper {
    background: #ffffff;
    border-radius: 20px;
    padding: 36px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid #f1f5f9;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
  }

  .form-control {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.95rem;
    font-family: inherit;
    background-color: #f8fafc;
    color: #1e293b;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .phone-input {
    text-align: left;
    direction: ltr;
  }

  .form-control:focus {
    outline: none;
    border-color: #1e40af;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }

  .submit-btn {
    background-color: #059669;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;
    font-family: inherit;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .submit-btn:hover {
    background-color: #047857;
    transform: translateY(-1px);
  }

  .success-message {
    background-color: #ecfdf5;
    border: 1px solid #d1fae5;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    color: #065f46;
  }

  .success-icon {
    width: 48px;
    height: 48px;
    background-color: #10b981;
    border-radius: 50%;
    margin: 0 auto 16px;
    position: relative;
  }

  .success-icon::after {
    content: '';
    position: absolute;
    left: 20px;
    top: 14px;
    width: 8px;
    height: 16px;
    border: solid #ffffff;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }

  .success-message h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  .success-message p {
    margin: 0 0 20px 0;
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .success-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }

  .btn-success-bale {
    background: #059669;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 10px;
    font-weight: 700;
    text-decoration: none;
    font-size: 14px;
  }

  .btn-reset {
    background: #ffffff;
    color: #065f46;
    border: 1px solid #a7f3d0;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
  }
</style>
