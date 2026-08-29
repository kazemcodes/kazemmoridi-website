<script lang="ts">
  import type { Project } from '../data/projects';

  export let onOpenPreview: (project: Project) => void;

  const ireaderProject: Project = {
    id: 'ireader',
    title: 'پلتفرم رمان‌خوان چندپلتفرمی IReader',
    category: 'apps',
    categoryLabel: 'محصول متن‌باز جهانی',
    tagline: 'رتبه ۱ نرم‌افزارهای رمان‌خوان متن‌باز با بیش از ۸۷۰ ستاره در گیت‌هاب',
    description: 'نرم‌افزار مدرن چندپلتفرمی ساخته شده با Kotlin Multiplatform و Jetpack Compose برای اندروید و دسکتاپ. با بیش از ۱۵۰۰ کامیت، موتور صوتی Piper TTS و سیستم ماژولار افزونه‌ها.',
    url: 'https://ireaderorg.netlify.app',
    displayUrl: 'ireaderorg.netlify.app',
    status: 'live',
    statusLabel: 'وب‌سایت رسمی',
    roleBadge: 'پلتفرم جهانی',
    highlights: [
      'چندپلتفرمی (اندروید، ویندوز، مک و لینوکس)',
      'سیستم اکستنشن ماژولار با KSP و CI/CD اتوماتیک',
      'موتور هوشمند تبدیل متن به گفتار آفلاین Piper TTS'
    ],
    techStack: ['Kotlin Multiplatform', 'Jetpack Compose', 'Vue.js', 'KSP', 'Piper TTS'],
    githubUrl: 'https://github.com/IReaderorg/IReader',
    previewAvailable: true
  };
</script>

<section class="ireader-spotlight" id="ireader">
  <div class="container">
    <div class="section-header">
      <span class="badge">پروژه شاخص جهانی (۸۷۰+ ستاره گیت‌هاب)</span>
      <h2 class="section-title">پلتفرم رمان‌خوان متن‌باز IReader</h2>
    </div>

    <div class="spotlight-grid">
      <!-- Main Info -->
      <div class="spotlight-card main-info">
        <h3 class="project-title">{ireaderProject.title}</h3>
        <p class="project-desc">{ireaderProject.description}</p>
        
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon screen-icon"></div>
            <div class="feature-text">پشتیبانی چند پلتفرمی (موبایل و دسکتاپ)</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon puzzle-icon"></div>
            <div class="feature-text">سیستم قدرتمند و ماژولار افزونه‌ها</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon audio-icon"></div>
            <div class="feature-text">موتور تبدیل متن به گفتار آفلاین (TTS)</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon sparkle-icon"></div>
            <div class="feature-text">رابط کاربری مدرن Material 3</div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary" on:click={() => onOpenPreview(ireaderProject)}>
            پیش‌نمایش آنلاین وب‌سایت
          </button>
          {#if ireaderProject.githubUrl}
            <a href={ireaderProject.githubUrl} target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              مخزن گیت‌هاب (۸۷۰ ستاره) ↗
            </a>
          {/if}
          <a href="https://github.com/IReaderorg/IReader/releases" target="_blank" rel="noopener noreferrer" class="btn btn-text">
            دانلود آخرین نسخه‌ها
          </a>
        </div>
      </div>

      <!-- Sidebar Stats -->
      <div class="spotlight-sidebar">
        <div class="stat-box">
          <div class="stat-label">پلتفرم‌های پشتیبانی شده</div>
          <div class="platform-chips">
            <span class="chip">Android (APK)</span>
            <span class="chip">Windows (EXE, MSI)</span>
            <span class="chip">macOS (DMG)</span>
            <span class="chip">Linux (DEB, AppImage)</span>
          </div>
        </div>
        <div class="stat-box">
          <div class="stat-label">تکنولوژی‌های اصلی</div>
          <div class="tech-tags">
            {#each ireaderProject.techStack as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .ireader-spotlight {
    padding: 100px 0;
    background-color: #fafbfc;
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

  .badge {
    display: inline-block;
    background-color: #fffbeb;
    color: #d97706;
    padding: 8px 16px;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 16px;
    border: 1px solid #fde68a;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
  }

  .spotlight-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (min-width: 992px) {
    .spotlight-grid {
      grid-template-columns: 2fr 1fr;
    }
  }

  .spotlight-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .main-info {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .project-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
  }

  .project-desc {
    font-size: 1.0625rem;
    color: #64748b;
    line-height: 1.8;
    margin: 0;
  }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 640px) {
    .features-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .feature-icon {
    width: 24px;
    height: 24px;
    background-color: #e0f2fe;
    border-radius: 6px;
    position: relative;
  }

  .screen-icon::after {
    content: '';
    position: absolute;
    top: 5px; left: 4px; right: 4px; bottom: 7px;
    border: 2px solid #0ea5e9;
    border-radius: 3px;
  }
  .screen-icon::before {
    content: '';
    position: absolute;
    bottom: 3px; left: 8px; right: 8px; height: 2px;
    background: #0ea5e9;
  }

  .puzzle-icon::after {
    content: '';
    position: absolute;
    top: 6px; left: 6px; width: 12px; height: 12px;
    border: 2px solid #0ea5e9;
    border-radius: 2px;
  }

  .audio-icon::after {
    content: '';
    position: absolute;
    top: 6px; left: 8px; width: 0; height: 0;
    border-style: solid;
    border-width: 6px 0 6px 8px;
    border-color: transparent transparent transparent #0ea5e9;
  }

  .sparkle-icon::after {
    content: '';
    position: absolute;
    top: 8px; left: 8px; width: 8px; height: 8px;
    background: #0ea5e9;
    transform: rotate(45deg);
  }

  .feature-text {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
  }

  .action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 8px;
  }

  .btn {
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 0.9375rem;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-family: inherit;
  }

  .btn-primary {
    background: #1e40af;
    color: #ffffff;
  }
  .btn-primary:hover {
    background: #1e3a8a;
  }

  .btn-outline {
    background: transparent;
    color: #1e40af;
    border: 2px solid #1e40af;
  }
  .btn-outline:hover {
    background: #eff6ff;
  }

  .btn-text {
    background: transparent;
    color: #64748b;
  }
  .btn-text:hover {
    color: #1e293b;
    background: #f1f5f9;
  }

  .spotlight-sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .stat-box {
    background: #ffffff;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .stat-label {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 20px;
  }

  .platform-chips {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .chip {
    padding: 12px 16px;
    background: #f8fafc;
    border-radius: 12px;
    font-size: 0.875rem;
    color: #334155;
    font-weight: 500;
    text-align: left;
    direction: ltr;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    padding: 6px 12px;
    background: #f1f5f9;
    color: #475569;
    border-radius: 9999px;
    font-size: 0.8125rem;
    font-weight: 500;
  }
</style>
