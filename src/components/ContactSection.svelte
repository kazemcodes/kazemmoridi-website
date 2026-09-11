<script lang="ts">
  import { onMount } from 'svelte';
  import { MessageSquare, Phone, Send, MessageCircle, Mail, MapPin, CheckCircle2, RotateCcw } from 'lucide-svelte';
  import { contactData } from '../data/contacts';

  let formName = '';
  let formPhone = '';
  let formService = '';
  let formMessage = '';
  let formSubmitted = false;

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
      if (e.detail) {
        if (e.detail.message) formMessage = e.detail.message;
        if (e.detail.service) formService = e.detail.service;
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
    const text = `سلام، درخواست جدید از سایت KM Studio:\nنام: ${formName}\nشماره تماس: ${formPhone}\nسرویس: ${serviceName}\nتوضیحات: ${formMessage}`;

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
          <div class="channel-icon-box bale-icon-box">
            <MessageSquare size={20} />
          </div>
          <div class="channel-info">
            <div class="channel-badge">پیام‌رسان اصلی</div>
            <h4 class="channel-title">پیام‌رسان بله (Bale)</h4>
            <div class="channel-value" dir="ltr">{contactData.baleUsername}</div>
            <span class="channel-hint">ارسال آنی پیام و ثبت سریع سفارش</span>
          </div>
        </a>

        <!-- Phone Direct -->
        <a href={`tel:${contactData.phone}`} class="channel-card phone-card">
          <div class="channel-icon-box phone-icon-box">
            <Phone size={20} />
          </div>
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
          <div class="channel-icon-box telegram-icon-box">
            <Send size={20} />
          </div>
          <div class="channel-info">
            <h4 class="channel-title">تلگرام (Telegram)</h4>
            <div class="channel-value" dir="ltr">{contactData.telegramUsername}</div>
            <span class="channel-hint">مشاوره آنلاین و ارسال مستندات</span>
          </div>
        </a>

        <!-- WhatsApp -->
        <a href={contactData.whatsapp} target="_blank" rel="noopener noreferrer" class="channel-card whatsapp-card">
          <div class="channel-icon-box whatsapp-icon-box">
            <MessageCircle size={20} />
          </div>
          <div class="channel-info">
            <h4 class="channel-title">واتس‌اپ (WhatsApp)</h4>
            <div class="channel-value phone-val" dir="ltr">
              <bdi dir="ltr">{contactData.phoneDisplay}</bdi>
            </div>
          </div>
        </a>

        <!-- Email -->
        <a href={`mailto:${contactData.email}`} class="channel-card email-card">
          <div class="channel-icon-box email-icon-box">
            <Mail size={20} />
          </div>
          <div class="channel-info">
            <h4 class="channel-title">ایمیل رسمی</h4>
            <div class="channel-value email-val">{contactData.email}</div>
          </div>
        </a>

        <div class="location-text">
          <MapPin size={16} />
          <span>موقعیت استودیو: {contactData.location}</span>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="contact-form-wrapper">
        {#if formSubmitted}
          <div class="success-message">
            <div class="success-icon-box">
              <CheckCircle2 size={44} />
            </div>
            <h3>درخواست شما با موفقیت ثبت شد!</h3>
            <p>در حال انتقال به پیام‌رسان بله برای ارتباط مستقیم هستیم. در صورت عدم انتقال، می‌توانید از دکمه‌های زیر استفاده کنید:</p>
            <div class="success-actions">
              <a href={contactData.bale} target="_blank" rel="noopener noreferrer" class="btn-success-bale">
                <MessageSquare size={16} />
                <span>ورود به چت در بله (Bale)</span>
              </a>
              <button class="btn-reset" on:click={() => (formSubmitted = false)}>
                <RotateCcw size={15} />
                <span>ثبت پیام جدید</span>
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
              <label for="service">نوع سرویس درخواستی</label>
              <select id="service" bind:value={formService} class="form-control">
                <option value="">انتخاب کنید (اختیاری)</option>
                <option value="طراحی وب‌سایت شرکتی">طراحی وب‌سایت شرکتی</option>
                <option value="فروشگاه اینترنتی اختصاصی">طراحی فروشگاه اینترنتی</option>
                <option value="وب‌اپلیکیشن اختصاصی">وب‌اپلیکیشن و سیستم ابری</option>
                <option value="طراحی UI/UX اختصاصی">طراحی UI/UX و برندینگ دیجیتال</option>
                <option value="بهینه‌سازی و سئو">بهینه‌سازی سرعت و سئو تکنیکال</option>
                <option value="مشاوره فنی و معماری نرم‌افزار">مشاوره فنی و نظارت بر پروژه</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">توضیحات پروژه یا سوال شما</label>
              <textarea 
                id="message" 
                bind:value={formMessage} 
                rows="4" 
                class="form-control" 
                placeholder="توضیحات مورد نظر، امکانات لازم یا پیام برآورد قیمت..."
              ></textarea>
            </div>

            <button type="submit" class="submit-btn">
              <span>ثبت درخواست و ارسال به پیام‌رسان بله (Bale)</span>
              <Send size={18} />
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

  .channel-icon-box {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .channel-card:hover .channel-icon-box {
    transform: scale(1.08);
  }

  .bale-icon-box { background-color: #dcfce7; color: #059669; }
  .phone-icon-box { background-color: #dbeafe; color: #1e40af; }
  .telegram-icon-box { background-color: #e0f2fe; color: #0284c7; }
  .whatsapp-icon-box { background-color: #d1fae5; color: #059669; }
  .email-icon-box { background-color: #e0e7ff; color: #4f46e5; }

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
    display: flex;
    align-items: center;
    gap: 8px;
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

  .success-icon-box {
    color: #10b981;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
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
    display: inline-flex;
    align-items: center;
    gap: 8px;
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
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
</style>
