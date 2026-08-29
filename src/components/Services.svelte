<script lang="ts">
  import { servicesData } from '../data/services';
</script>

<section class="services-section" id="services">
  <div class="container">
    <div class="section-header">
      <span class="accent-label">خدمات ما</span>
      <h2 class="title">راهکارهای دیجیتال برای کسب‌و‌کار شما</h2>
      <p class="description">
        طراحی و توسعه سیستم‌های مدرن، سریع و بهینه با تمرکز بر تجربه کاربری و استانداردهای روز جهانی.
      </p>
    </div>

    <div class="services-grid">
      {#each servicesData as service}
        <div class="service-card">
          <div class="card-header">
            <div class="icon-box">
              <span class="icon">{service.icon}</span>
            </div>
            <h3 class="service-title">{service.title}</h3>
          </div>
          <p class="service-desc">{service.description}</p>
          
          <ul class="features-list">
            {#each service.features as feature}
              <li>
                <span class="check-mark"></span>
                {feature}
              </li>
            {/each}
          </ul>

          <div class="tags-wrapper">
            {#each service.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <div class="cta-banner">
      <div class="cta-content">
        <h3>آماده شروع پروژه جدید هستید؟</h3>
        <p>برای بررسی نیازهای پروژه و دریافت مشاوره رایگان با ما در ارتباط باشید.</p>
      </div>
      <a href="#contact" class="cta-btn">درخواست مشاوره رایگان ↗</a>
    </div>
  </div>
</section>

<style>
  .services-section {
    padding: 6rem 0;
    background: #fafbfc;
    direction: rtl;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  
  /* Header */
  .section-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 4rem auto;
  }
  .accent-label {
    display: inline-block;
    background: rgba(14, 165, 233, 0.1);
    color: #0ea5e9;
    font-size: 13px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 99px;
    margin-bottom: 16px;
  }
  .title {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 16px;
  }
  .description {
    font-size: 15px;
    color: #64748b;
    line-height: 1.8;
  }

  /* Grid */
  .services-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 4rem;
  }
  @media (min-width: 768px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 1024px) {
    .services-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* Card */
  .service-card {
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  .service-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  .icon-box {
    width: 44px;
    height: 44px;
    background: #f8fafc;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .icon {
    font-size: 20px;
  }
  .service-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  .service-desc {
    font-size: 14px;
    color: #64748b;
    line-height: 1.8;
    margin: 0 0 24px 0;
  }

  /* Features */
  .features-list {
    list-style: none;
    padding: 0;
    margin: 0 0 24px 0;
    flex-grow: 1;
  }
  .features-list li {
    font-size: 13px;
    color: #475569;
    margin-bottom: 12px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.6;
  }
  .check-mark {
    position: relative;
    width: 16px;
    height: 16px;
    background: #059669;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .check-mark::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%) rotate(45deg);
  }

  /* Tags */
  .tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
  }
  .tag {
    font-size: 11px;
    font-weight: 600;
    background: #f8fafc;
    color: #64748b;
    padding: 4px 10px;
    border-radius: 99px;
    border: 1px solid #f1f5f9;
  }

  /* CTA */
  .cta-banner {
    background: linear-gradient(135deg, #1e40af, #0ea5e9);
    border-radius: 20px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
    box-shadow: 0 10px 25px rgba(14, 165, 233, 0.2);
  }
  @media (min-width: 768px) {
    .cta-banner {
      flex-direction: row;
      justify-content: space-between;
      text-align: right;
      padding: 40px;
    }
  }
  .cta-content h3 {
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 12px 0;
  }
  .cta-content p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
    margin: 0;
  }
  .cta-btn {
    background: #ffffff;
    color: #1e40af;
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    white-space: nowrap;
  }
  .cta-btn:hover {
    background: #f8fafc;
    transform: scale(1.02);
  }
</style>
