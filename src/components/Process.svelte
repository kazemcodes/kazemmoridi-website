<script lang="ts">
  import { processSteps } from '../data/process';
  import { contactData } from '../data/contacts';
</script>

<section class="section" id="process">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">فرآیند همکاری</span>
      <h2 class="section-title">از ایده تا تحویل وب‌سایت چگونه پیش می‌رویم؟</h2>
      <p class="section-desc">
        ما یک فرآیند ۵ مرحله‌ای چابک و شفاف را دنبال می‌کنیم تا از کیفیت مهندسی، انطباق با سلیقه شما و تحویل به‌موقع پروژه اطمینان حاصل شود:
      </p>
    </div>

    <div class="process-grid">
      {#each processSteps as step}
        <div class="process-card">
          <div class="step-badge-num">{step.number}</div>
          <h3 class="step-title">{step.title}</h3>
          <p class="step-desc">{step.description}</p>
          
          <div class="deliverables-box">
            <span class="del-heading">خروجی‌های این مرحله:</span>
            {#each step.deliverables as d}
              <div class="del-item">
                <span class="del-dot">✓</span>
                <span>{d}</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- CTA Consultation Banner -->
    <div class="cta-banner">
      <div class="cta-content">
        <h2>آماده‌اید پروژه جدیدتان را به یک موفقیت دیجیتال تبدیل کنید؟</h2>
        <p>همین امروز با کارشناسان استودیو مریدی در ارتباط باشید تا پس از بررسی اهداف شما، برآورد دقیق فنی و مشاوره رایگان دریافت کنید.</p>
      </div>
      <div class="cta-actions">
        <a href={`tel:${contactData.phone}`} class="btn btn-white btn-lg">
          <span>تماس تلفنی:</span>
          <bdi dir="ltr" class="phone-digits">{contactData.phoneDisplay}</bdi>
        </a>
        <a href={contactData.bale} target="_blank" rel="noopener noreferrer" class="btn btn-outline-white btn-lg">
          پیام در بله (Bale) ↗
        </a>
        <a href="#contact" class="btn btn-outline-white btn-lg">
          ثبت فرم درخواست آنلاین
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .process-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 56px;
  }

  @media (min-width: 640px) {
    .process-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  }

  @media (min-width: 1024px) {
    .process-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }
  }

  .process-card {
    background: #ffffff;
    border: 1.5px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    padding: 30px 24px;
    box-shadow: var(--shadow-xs);
    display: flex;
    flex-direction: column;
    position: relative;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .process-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .step-badge-num {
    font-size: 28px;
    font-weight: 900;
    color: var(--primary);
    line-height: 1;
    margin-bottom: 14px;
    font-family: var(--font-fa);
  }

  .step-title {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 10px;
    color: var(--text-main);
  }

  .step-desc {
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.8;
    margin-bottom: 18px;
    flex: 1;
  }

  .deliverables-box {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border: 1px solid var(--border-light);
  }

  .del-heading {
    font-size: 11.5px;
    font-weight: 700;
    color: var(--text-subtle);
    margin-bottom: 2px;
  }

  .del-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    color: var(--text-main);
    font-weight: 500;
  }

  .del-dot {
    color: var(--success);
    font-size: 12px;
    font-weight: 900;
  }

  /* CTA Banner */
  .cta-banner {
    background: var(--grad-primary);
    color: #ffffff;
    border-radius: var(--radius-xl);
    padding: 48px 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    box-shadow: var(--shadow-primary);
    text-align: center;
  }

  @media (min-width: 1024px) {
    .cta-banner {
      flex-direction: row;
      text-align: right;
      padding: 56px 48px;
    }
  }

  .cta-content h2 {
    color: #ffffff;
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 900;
    margin-bottom: 10px;
  }

  .cta-content p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
    max-width: 600px;
    line-height: 1.8;
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }

  .btn-outline-white {
    background: transparent;
    color: #ffffff;
    border: 2px solid rgba(255, 255, 255, 0.6);
  }

  .btn-outline-white:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #ffffff;
  }
</style>
