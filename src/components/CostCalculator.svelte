<script lang="ts">
  import { projectTypes, featureOptions, type ProjectTypeOption, type FeatureOption } from '../data/calculator';
  import { contactData } from '../data/contacts';
  import { toPersianDigits } from '../utils/persianDigits';

  let selectedType: string = 'store';
  let selectedFeatures: string[] = ['payment', 'sms', 'seo_adv', 'support_vip'];

  $: currentType = projectTypes.find(t => t.id === selectedType) || projectTypes[0];

  $: totalBasePrice = currentType.basePrice;
  $: totalBaseDays = currentType.baseDays;

  $: featuresPrice = selectedFeatures.reduce((acc, featId) => {
    const feat = featureOptions.find(f => f.id === featId);
    return acc + (feat ? feat.price : 0);
  }, 0);

  $: featuresDays = selectedFeatures.reduce((acc, featId) => {
    const feat = featureOptions.find(f => f.id === featId);
    return acc + (feat ? feat.days : 0);
  }, 0);

  $: estimatedMinPrice = Math.round(totalBasePrice + featuresPrice);
  $: estimatedMaxPrice = Math.round((totalBasePrice + featuresPrice) * 1.2);
  $: estimatedDays = Math.round(totalBaseDays + featuresDays);

  function toggleFeature(id: string) {
    if (selectedFeatures.includes(id)) {
      selectedFeatures = selectedFeatures.filter(f => f !== id);
    } else {
      selectedFeatures = [...selectedFeatures, id];
    }
  }

  function getSummaryText(): string {
    const featTitles = selectedFeatures
      .map(id => featureOptions.find(f => f.id === id)?.title)
      .filter(Boolean)
      .join('، ');
    return `سلام، من برای پروژه «${currentType.title}» با امکانات [${featTitles}] و برآورد قیمت تقریبی ${toPersianDigits(estimatedMinPrice)} الی ${toPersianDigits(estimatedMaxPrice)} میلیون تومان نیاز به مشاوره و استعلام زمان و قیمت دارم.`;
  }

  function handleOrderClick(e: MouseEvent) {
    e.preventDefault();
    const msg = getSummaryText();
    const serviceMap: Record<string, string> = {
      store: 'ecommerce',
      platform: 'laravel',
      corporate: 'corporate',
      app: 'mobile'
    };
    const service = serviceMap[selectedType] || 'other';

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prefill-quote', {
        detail: { message: msg, service }
      }));
      window.location.hash = `#contact?msg=${encodeURIComponent(msg)}&service=${service}`;
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
</script>

<section class="section" id="calculator">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">محاسبه آنلاین هزینه</span>
      <h2 class="section-title">برآورد آنلاین و تقریبی هزینه و زمان تحویل پروژه</h2>
      <p class="section-desc">
        نوع وب‌سایت و ویژگی‌های مد نظرتان را انتخاب کنید تا محدوده برآورد قیمت مهندسی و مدت زمان لازم برای طراحی و پیاده‌سازی را مشاهده کنید:
      </p>
    </div>

    <div class="calculator-grid">
      <!-- Left Configurator Options -->
      <div class="calculator-config">
        <!-- Step 1: Project Type -->
        <div class="config-group">
          <div class="group-title">
            <span class="step-badge">۱</span>
            <span>نوع وب‌سایت یا پروژه خود را انتخاب کنید:</span>
          </div>

          <div class="type-options-grid">
            {#each projectTypes as typeOption}
              <button 
                class="type-card" 
                class:selected={selectedType === typeOption.id}
                on:click={() => selectedType = typeOption.id}
              >
                <span class="type-icon">{typeOption.icon}</span>
                <span class="type-name">{typeOption.title}</span>
                <span class="type-desc">{typeOption.desc}</span>
                <span class="type-base">پایه از {toPersianDigits(typeOption.basePrice)} میلیون تومان</span>
              </button>
            {/each}
          </div>
        </div>

        <!-- Step 2: Features -->
        <div class="config-group">
          <div class="group-title">
            <span class="step-badge">۲</span>
            <span>امکانات و ماژول‌های مورد نیازتان را انتخاب کنید:</span>
          </div>

          <div class="features-options-grid">
            {#each featureOptions as feat}
              <button 
                class="feature-pill" 
                class:selected={selectedFeatures.includes(feat.id)}
                on:click={() => toggleFeature(feat.id)}
              >
                <span class="feat-checkbox">
                  {#if selectedFeatures.includes(feat.id)}✓{/if}
                </span>
                <span class="feat-title">{feat.title}</span>
                <span class="feat-cost">+{toPersianDigits(feat.price)} م.ت</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Right Summary & Quote Box -->
      <div class="calculator-summary-box">
        <div class="summary-card">
          <div class="summary-header">
            <h3>برآورد تقریبی استودیو</h3>
            <span class="summary-badge">بدون هزینه پنهان</span>
          </div>

          <div class="summary-body">
            <div class="summary-row">
              <span>پروژه انتخابی:</span>
              <strong>{currentType.title}</strong>
            </div>

            <div class="summary-row">
              <span>تعداد ماژول‌های فعال:</span>
              <strong>{toPersianDigits(selectedFeatures.length)} ویژگی</strong>
            </div>

            <div class="price-callout">
              <span class="callout-label">بازه قیمت تخمینی پیاده‌سازی:</span>
              <div class="callout-price">
                <span class="price-val">{toPersianDigits(estimatedMinPrice)} الی {toPersianDigits(estimatedMaxPrice)}</span>
                <span class="price-unit">میلیون تومان</span>
              </div>
              <span class="callout-note">شامل طراحی UI/UX، کدنویسی، تست و آموزش پنل</span>
            </div>

            <div class="delivery-row">
              <div class="del-dot"></div>
              <div class="del-info">
                <span>زمان تحویل تضمین‌شده:</span>
                <strong>تقریباً {toPersianDigits(estimatedDays)} روز کاری</strong>
              </div>
            </div>

            <div class="guarantees-mini">
              <div class="g-item">✓ گارانتی بازگشت وجه در صورت عدم تطابق</div>
              <div class="g-item">✓ پشتیبانی فنی رایگان پس از تحویل</div>
              <div class="g-item">✓ عقد قرارداد رسمی و مکتوب</div>
            </div>

            <div class="summary-actions">
              <!-- Bale Direct Button -->
              <a 
                href={`https://ble.ir/kazem_moridi?text=${encodeURIComponent(getSummaryText())}`}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-bale"
              >
                <span>ارسال مستقیم برآورد به بله (Bale) ↗</span>
              </a>

              <!-- Fill Site Form Button -->
              <button 
                type="button"
                class="btn btn-primary btn-lg" 
                on:click={handleOrderClick}
              >
                تکمیل فرم ثبت سفارش در سایت ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .calculator-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    align-items: flex-start;
  }

  @media (min-width: 1024px) {
    .calculator-grid {
      grid-template-columns: 1.4fr 0.9fr;
      gap: 40px;
    }
  }

  /* Configurator */
  .calculator-config {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .config-group {
    background: #ffffff;
    border: 1.5px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    padding: 26px;
    box-shadow: var(--shadow-xs);
  }

  .group-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 800;
    color: var(--text-main);
    margin-bottom: 20px;
  }

  .step-badge {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
  }

  /* Types Grid */
  .type-options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 640px) {
    .type-options-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .type-card {
    background: var(--bg-surface);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    padding: 16px;
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: all 0.2s ease;
  }

  .type-card:hover {
    border-color: var(--border-strong);
    background: #ffffff;
  }

  .type-card.selected {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  .type-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .type-name {
    font-size: 15px;
    font-weight: 800;
    color: var(--text-main);
  }

  .type-desc {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 6px;
  }

  .type-base {
    font-size: 11.5px;
    font-weight: 700;
    color: var(--primary);
    margin-top: auto;
  }

  /* Features Grid */
  .features-options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  @media (min-width: 640px) {
    .features-options-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .feature-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--bg-surface);
    border: 1.5px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 10px 14px;
    text-align: right;
    transition: all 0.15s ease;
  }

  .feature-pill:hover {
    border-color: var(--primary);
  }

  .feature-pill.selected {
    background: var(--primary-light);
    border-color: var(--primary);
  }

  .feat-checkbox {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1.5px solid var(--border-strong);
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 900;
    color: var(--primary);
    flex-shrink: 0;
  }

  .feature-pill.selected .feat-checkbox {
    border-color: var(--primary);
    background: var(--primary);
    color: #ffffff;
  }

  .feat-title {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-main);
    flex: 1;
  }

  .feat-cost {
    font-size: 11.5px;
    font-weight: 700;
    color: var(--primary);
    font-family: var(--font-fa);
    background: #ffffff;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid var(--border-light);
  }

  /* Summary Card */
  .summary-card {
    background: #ffffff;
    border: 2px solid var(--border-accent);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    position: sticky;
    top: 90px;
  }

  .summary-header {
    background: var(--grad-primary);
    color: #ffffff;
    padding: 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .summary-header h3 {
    color: #ffffff;
    font-size: 17px;
    font-weight: 800;
  }

  .summary-badge {
    font-size: 11px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.2);
    padding: 3px 8px;
    border-radius: var(--radius-full);
  }

  .summary-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13.5px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-light);
  }

  .price-callout {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 16px;
    text-align: center;
  }

  .callout-label {
    display: block;
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .callout-price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .price-val {
    font-size: 26px;
    font-weight: 900;
    color: var(--primary);
    font-family: var(--font-fa);
  }

  .price-unit {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-main);
  }

  .callout-note {
    display: block;
    font-size: 11.5px;
    color: var(--text-subtle);
  }

  .delivery-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: var(--success-light);
    border-radius: var(--radius-md);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .del-dot {
    width: 10px;
    height: 10px;
    background: #059669;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .del-info {
    display: flex;
    flex-direction: column;
    font-size: 12.5px;
    color: #065f46;
  }

  .guarantees-mini {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 600;
    padding: 6px 0;
  }

  .g-item {
    color: #047857;
  }

  .summary-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
  }

  .btn-bale {
    background: #059669;
    color: #ffffff;
    padding: 14px 20px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    text-align: center;
    text-decoration: none;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
  }

  .btn-bale:hover {
    background: #047857;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);
  }
</style>
