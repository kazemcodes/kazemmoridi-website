<script lang="ts">
  // WhyUs component
</script>

<section class="section section-alt" id="why-us">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">چرا استودیو مریدی؟</span>
      <h2 class="section-title">چرا استودیو مریدی انتخاب اول کسب‌وکارهای موفق است؟</h2>
      <p class="section-desc">
        تفاوت ما در رعایت تعهدات، مهندسی نرم‌افزار تمیز و تمرکز بر افزایش فروش و کارایی واقعی پروژه‌هاست، نه صرفاً تحویل یک قالب آماده:
      </p>
    </div>

    <div class="why-grid">
      <!-- Item 1 -->
      <div class="why-card">
        <div class="why-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        </div>
        <h3>بدون استفاده از قالب‌های آماده و افزونه‌های سنگین</h3>
        <p>بسیاری از طراحان وب با نصب ده‌ها افزونه آماده و قالب‌های فارسی‌شده کند، سایت‌هایی سنگین تحویل می‌دهند. ما کدهای استاندارد، اختصاصی و سبک می‌نویسیم که تا سال‌ها بدون خطا و کرش کار کنند.</p>
        <div class="why-badge-row">
          <span class="w-badge">Clean Code</span>
          <span class="w-badge">توسعه‌پذیر</span>
        </div>
      </div>

      <!-- Item 2 -->
      <div class="why-card">
        <div class="why-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
        <h3>تضمین سرعت لود زیر ۲ ثانیه و لایت‌هاوس ۹۰+</h3>
        <p>سرعت سایت مستقیماً بر فروش و سئوی گوگل اثرگذار است. ما تصاویر، فونت‌ها و فایل‌های وب‌سایت را طوری فشرده و کش‌گذاری می‌کنیم که کاربران حتی با اینترنت ضعیف موبایل فوراً به محتوا دسترسی داشته باشند.</p>
        <div class="why-badge-row">
          <span class="w-badge">Core Web Vitals</span>
          <span class="w-badge">امتیاز ۹۵+ گوگل</span>
        </div>
      </div>

      <!-- Item 3 -->
      <div class="why-card">
        <div class="why-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <h3>گارانتی بازگشت وجه و قرارداد شفاف و رسمی</h3>
        <p>ما به کیفیت کار خود اطمینان کامل داریم. در صورت عدم تطابق خروجی با نیازسنجی تاییدشده، متعهد به اصلاح کامل یا بازگشت کامل وجه خواهیم بود. تمامی مراحل با عقد قرارداد رسمی انجام می‌شود.</p>
        <div class="why-badge-row">
          <span class="w-badge">۱۰۰٪ تضمین رضایت</span>
          <span class="w-badge">قرارداد معتبر</span>
        </div>
      </div>

      <!-- Item 4 -->
      <div class="why-card">
        <div class="why-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <h3>کاهش تا ۹۰٪ هزینه‌های هاست و سرور</h3>
        <p>معماری‌های بهینه‌شده ما اجازه می‌دهد حتی وب‌سایت‌های پربازدید بدون نیاز به خرید سرورهای اختصاصی ماهانه چند میلیونی، بر روی هاست‌های اشتراکی باکیفیت و اقتصادی مستقر شوند.</p>
        <div class="why-badge-row">
          <span class="w-badge">صرفه‌جویی پایدار</span>
          <span class="w-badge">مدیریت بهینه رم و پردازنده</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .why-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 26px;
  }

  @media (min-width: 768px) {
    .why-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
    }
  }

  .why-card {
    background: #ffffff;
    border: 1.5px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    padding: 32px 28px;
    box-shadow: var(--shadow-xs);
    display: flex;
    flex-direction: column;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .why-card:hover {
    transform: translateY(-4px);
    border-color: var(--border-accent);
    box-shadow: var(--shadow-lg);
  }

  .why-icon-box {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-lg);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-bottom: 18px;
  }

  .why-card h3 {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 10px;
    color: var(--text-main);
  }

  .why-card p {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.85;
    margin-bottom: 18px;
    flex: 1;
  }

  .why-badge-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding-top: 14px;
    border-top: 1px solid var(--border-light);
  }

  .w-badge {
    font-size: 12px;
    font-weight: 700;
    color: #047857;
    background: var(--success-light);
    padding: 3px 10px;
    border-radius: var(--radius-full);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
</style>
