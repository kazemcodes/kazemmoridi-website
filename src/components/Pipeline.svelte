<script lang="ts">
  import { pipelineData } from '../data/pipeline';
  import { toPersianDigits } from '../utils/persianDigits';
</script>

<section class="section section-alt" id="pipeline">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">در حال ساخت</span>
      <h2 class="section-title">محصولات و نوآوری‌هایی که در حال ساخت آن‌ها هستیم</h2>
      <p class="section-desc">
        ما همواره در حال توسعه محصولات جدید، ابزارهای کاربردی و معماری‌های نوین با تکیه بر استانداردهای مهندسی نرم‌افزار هستیم. نگاهی به خط تولید فعال استودیو ما بیندازید:
      </p>
    </div>

    <div class="pipeline-grid">
      {#each pipelineData as item}
        <div class="pipeline-card">
          <!-- Stage badge -->
          <div class="pipeline-top">
            <span class="stage-badge" style={`color: ${item.stageColor}; background: ${item.stageColor}1A;`}>
              {item.stageLabel}
            </span>
            <span class="launch-date">موعد انتشار: {item.targetLaunch}</span>
          </div>

          <h3 class="pipeline-title">{item.title}</h3>
          <div class="pipeline-subtitle">{item.subtitle}</div>
          <p class="pipeline-desc">{item.description}</p>

          <!-- Progress Bar -->
          <div class="progress-box">
            <div class="progress-labels">
              <span>درصد پیشرفت توسعه</span>
              <span class="progress-num">{toPersianDigits(item.progressPercent)}٪</span>
            </div>
            <div class="progress-track">
              <div 
                class="progress-fill" 
                style={`width: ${item.progressPercent}%; background: ${item.stageColor};`}
              ></div>
            </div>
          </div>

          <!-- Feature Bullets -->
          <div class="pipeline-features">
            {#each item.features as feat}
              <div class="p-feat-row">
                <span class="feat-dot">→</span>
                <span>{feat}</span>
              </div>
            {/each}
          </div>

          <!-- Tech chips -->
          <div class="pipeline-tech">
            {#each item.techStack as tech}
              <span class="p-tech-pill">{tech}</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .pipeline-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @media (min-width: 1024px) {
    .pipeline-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .pipeline-card {
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 16px;
    padding: 32px 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .pipeline-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .pipeline-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .stage-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 700;
  }

  .launch-date {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }

  .pipeline-title {
    font-size: 20px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .pipeline-subtitle {
    font-size: 13px;
    font-weight: 600;
    color: #0ea5e9;
    margin-bottom: 16px;
  }

  .pipeline-desc {
    font-size: 14px;
    color: #64748b;
    line-height: 1.8;
    margin-bottom: 24px;
  }

  /* Progress */
  .progress-box {
    margin-bottom: 24px;
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #1e293b;
  }

  .progress-num {
    font-family: var(--font-fa);
    font-weight: 800;
  }

  .progress-track {
    height: 4px;
    background: #f1f5f9;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.6s ease;
  }

  /* Features */
  .pipeline-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 24px;
    flex: 1;
  }

  .p-feat-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: #1e293b;
  }

  .feat-dot {
    color: #94a3b8;
    font-weight: bold;
  }

  /* Tech */
  .pipeline-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
  }

  .p-tech-pill {
    font-size: 11px;
    background: #f8fafc;
    color: #64748b;
    padding: 4px 10px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }
</style>
