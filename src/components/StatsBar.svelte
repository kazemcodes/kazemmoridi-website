<script lang="ts">
  // No specific imports needed for StatsBar
</script>

<section class="stats-section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon stat-blue"></div>
        <div class="stat-content">
          <span class="stat-number">۱۵+</span>
          <span class="stat-label">وب‌سایت تحویل داده شده</span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="stat-item">
        <div class="stat-icon stat-orange"></div>
        <div class="stat-content">
          <span class="stat-number">۵</span>
          <span class="stat-label">هنرستان تحت پوشش</span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="stat-item">
        <div class="stat-icon stat-green"></div>
        <div class="stat-content">
          <span class="stat-number">۸۷۰+</span>
          <span class="stat-label">ستاره گیت‌هاب</span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="stat-item">
        <div class="stat-icon stat-sky"></div>
        <div class="stat-content">
          <span class="stat-number">زیر ۱٫۵ ثانیه</span>
          <span class="stat-label">زمان بارگذاری</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .stats-section {
    padding: 3rem 0;
    border-top: 1px solid #f1f5f9;
    border-bottom: 1px solid #f1f5f9;
    background: #ffffff;
    direction: rtl;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  .stats-grid {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .divider {
    display: none;
    width: 1px;
    background: #f1f5f9;
    height: 48px;
  }
  .stat-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }
  .stat-icon {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .stat-blue { background: #1e40af; }
  .stat-orange { background: #f97316; border-radius: 50%; }
  .stat-green { background: #059669; transform: rotate(45deg); }
  .stat-sky { background: #0ea5e9; border-radius: 8px 0 8px 0; }

  .stat-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .stat-number {
    font-size: 28px;
    font-weight: 700;
    color: #1e40af;
    line-height: 1.2;
  }
  .stat-label {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
  }

  @media (min-width: 768px) {
    .stats-grid {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 1.5rem;
    }
    .stat-item {
      width: calc(50% - 1.5rem);
      justify-content: flex-start;
    }
  }

  @media (min-width: 1024px) {
    .stats-grid {
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
    }
    .stat-item {
      width: auto;
    }
    .divider {
      display: block;
    }
  }
</style>
