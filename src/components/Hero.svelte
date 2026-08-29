<script lang="ts">
  import { contactData } from '../data/contacts';
</script>

<section class="hero-section" id="hero">
  <!-- Subtle Background Grid & Glows -->
  <div class="hero-bg-grid"></div>
  <div class="hero-glow hero-glow-1"></div>
  <div class="hero-glow hero-glow-2"></div>

  <div class="container">
    <div class="hero-layout">
      <!-- Main Content -->
      <div class="hero-content">
        <h1 class="hero-title animate-fade-in">
          ما وب‌سایت‌های <span class="text-accent">حرفه‌ای</span> و <span class="text-accent">پرسرعت</span> می‌سازیم
        </h1>

        <p class="hero-desc animate-fade-in">
          ما به کسب‌وکارها، استارتاپ‌ها و سازمان‌ها کمک می‌کنیم تا با وب‌سایت‌های سبک، فروشگاه‌های اینترنتی با نرخ تبدیل بالا و پلتفرم‌های نرم‌افزاری اختصاصی، با بالاترین سرعت و بدون اتلاف هزینه رشد کنند.
        </p>

        <div class="hero-actions animate-fade-in">
          <a href="#contact" class="btn btn-primary btn-lg">شروع پروژه</a>
          <a href={contactData.bale} target="_blank" rel="noopener noreferrer" class="btn btn-bale-hero btn-lg">پیام در بله (Bale) ↗</a>
          <a href="#projects" class="btn btn-outline btn-lg">مشاهده نمونه‌کارها</a>
        </div>

        <div class="hero-trust-list animate-fade-in">
          <div class="trust-item">
            <span class="check-icon"></span>
            <span>تحویل سریع</span>
          </div>
          <div class="trust-item">
            <span class="check-icon"></span>
            <span>سئو حرفه‌ای</span>
          </div>
          <div class="trust-item">
            <span class="check-icon"></span>
            <span>پشتیبانی ۲۴/۷</span>
          </div>
          <div class="trust-item">
            <span class="check-icon"></span>
            <span>قیمت منصفانه</span>
          </div>
        </div>
      </div>

      <!-- Studio Showcase Card -->
      <div class="hero-visual animate-fade-in-up">
        <div class="visual-card">
          <div class="visual-card-body">
            <div class="avatar-row">
              <div class="avatar-box">
                <img src="/assets/profile.jpg" alt="استودیو مریدی" width="64" height="64" />
              </div>
              <div class="avatar-info">
                <h4>استودیو مریدی (KM Studio)</h4>
                <p class="role-text">معمار وب و مهندس نرم‌افزار</p>
              </div>
            </div>

            <div class="stats-mini-grid">
              <div class="stat-mini">
                <span class="num">۱۵+</span>
                <span class="label">پروژه</span>
              </div>
              <div class="stat-mini">
                <span class="num">۵</span>
                <span class="label">هنرستان</span>
              </div>
              <div class="stat-mini">
                <span class="num">۸۷۰+</span>
                <span class="label">ستاره</span>
              </div>
              <div class="stat-mini">
                <span class="num">۱۰۰٪</span>
                <span class="label">رضایت</span>
              </div>
            </div>

            <div class="visual-tech-row">
              <span class="tech-chip">Laravel</span>
              <span class="tech-chip">Svelte</span>
              <span class="tech-chip">Flutter</span>
              <span class="tech-chip">WooCommerce</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero-section {
    position: relative;
    padding: 80px 0;
    background-color: #fafbfc;
    overflow: hidden;
  }

  @media (min-width: 1024px) {
    .hero-section {
      padding: 120px 0 100px;
    }
  }

  /* Background */
  .hero-bg-grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.4;
    mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
    pointer-events: none;
  }

  .hero-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    opacity: 0.15;
  }

  .hero-glow-1 {
    top: -200px;
    right: -100px;
    background: #0ea5e9;
  }

  .hero-glow-2 {
    bottom: -200px;
    left: -100px;
    background: #1e40af;
  }

  /* Layout */
  .hero-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 60px;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  @media (min-width: 1024px) {
    .hero-layout {
      grid-template-columns: 1.2fr 0.8fr;
      gap: 80px;
    }
  }

  /* Content */
  .hero-title {
    font-size: clamp(32px, 4.5vw, 52px);
    font-weight: 900;
    line-height: 1.3;
    color: #1e293b;
    margin-bottom: 24px;
    letter-spacing: -1px;
  }

  .text-accent {
    color: #0ea5e9;
  }

  .hero-desc {
    font-size: 17px;
    color: #64748b;
    line-height: 1.8;
    margin-bottom: 40px;
    max-width: 580px;
  }

  /* CTAs */
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 48px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 32px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 16px;
    transition: all 0.2s ease;
    text-decoration: none;
    cursor: pointer;
  }

  .btn-primary {
    background: #1e40af;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(30, 64, 175, 0.25);
  }

  .btn-primary:hover {
    background: #1e3a8a;
    transform: translateY(-2px);
  }

  .btn-bale-hero {
    background: #ecfdf5;
    color: #059669;
    border: 2px solid #a7f3d0;
  }

  .btn-bale-hero:hover {
    background: #d1fae5;
    border-color: #6ee7b7;
    color: #047857;
    transform: translateY(-2px);
  }

  .btn-outline {
    background: transparent;
    color: #1e293b;
    border: 2px solid #e2e8f0;
  }

  .btn-outline:hover {
    border-color: #cbd5e1;
    background: #f1f5f9;
  }

  /* Trust List */
  .hero-trust-list {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
  }

  .check-icon {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: #d1fae5;
    position: relative;
    flex-shrink: 0;
  }

  .check-icon::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 8px;
    width: 5px;
    height: 10px;
    border: solid #059669;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  /* Visual Card */
  .hero-visual {
    display: flex;
    justify-content: center;
  }

  .visual-card {
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 32px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .visual-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 45px -12px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .visual-card-body {
    display: flex;
    flex-direction: column;
  }

  .avatar-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
  }

  .avatar-box {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    background: #f1f5f9;
    flex-shrink: 0;
    border: 2px solid #e0e7ff;
  }

  .avatar-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-info h4 {
    font-size: 18px;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 6px 0;
  }

  .role-text {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }

  .stats-mini-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-mini {
    background: #fafbfc;
    padding: 16px;
    border-radius: 16px;
    text-align: center;
    border: 1px solid #f1f5f9;
  }

  .stat-mini .num {
    display: block;
    font-size: 22px;
    font-weight: 900;
    color: #1e40af;
    line-height: 1.2;
    margin-bottom: 6px;
    font-family: var(--font-fa);
  }

  .stat-mini .label {
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
  }

  .visual-tech-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }

  .tech-chip {
    font-size: 13px;
    font-weight: 600;
    background: #f0f9ff;
    color: #0ea5e9;
    padding: 6px 14px;
    border-radius: 20px;
    font-family: monospace;
  }

  /* Animations */
  .animate-fade-in {
    animation: fadeIn 0.8s ease backwards;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease backwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
