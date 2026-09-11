<script lang="ts">
  import { onMount } from 'svelte';
  import { getDatabase, type Invoice, type OfficialLetter } from '../../services/db';
  import { formatPrice } from '../../utils/numberToWords';
  import { toPersianDigits } from '../../utils/persianDigits';

  export let onNavigate: (tab: string, param?: string) => void;

  let invoices: Invoice[] = [];
  let letters: OfficialLetter[] = [];
  let loading = true;

  onMount(async () => {
    try {
      const db = getDatabase();
      const [invList, letList] = await Promise.all([
        db.getInvoices(),
        db.getLetters()
      ]);
      invoices = invList;
      letters = letList;
    } catch (e) {
      console.error('Error loading dashboard data', e);
    } finally {
      loading = false;
    }
  });

  $: totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  $: pendingAmount = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  $: paidCount = invoices.filter(i => i.status === 'paid').length;
  $: pendingCount = invoices.filter(i => i.status === 'pending').length;
</script>

<div class="dashboard-view">
  <div class="view-header">
    <div class="header-titles">
      <h2>داشبورد مالی و مکاتبات اداری</h2>
      <p>مرور اجمالی فاکتورهای فروش، پیش‌فاکتورهای فعال و نامه‌های رسمی استودیو</p>
    </div>
    <div class="header-actions">
      <button class="btn btn-primary" on:click={() => onNavigate('invoice-new')}>
        + صدور فاکتور / پیش‌فاکتور جدید
      </button>
      <button class="btn btn-outline" on:click={() => onNavigate('letter-new')}>
        + نگارش نامه اداری جدید
      </button>
    </div>
  </div>

  {#if loading}
    <div class="loading-state">در حال بارگذاری اطلاعات از دیتابیس...</div>
  {:else}
    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card card-blue">
        <div class="metric-icon">💰</div>
        <div class="metric-content">
          <span class="metric-label">کل دریافتی تسویه‌شده</span>
          <div class="metric-value">
            <strong>{toPersianDigits(formatPrice(totalRevenue))}</strong>
            <span class="unit">تومان</span>
          </div>
          <span class="metric-hint">{toPersianDigits(paidCount)} فاکتور پرداخت‌شده</span>
        </div>
      </div>

      <div class="metric-card card-amber">
        <div class="metric-icon">⏳</div>
        <div class="metric-content">
          <span class="metric-label">مطالبات در انتظار پرداخت</span>
          <div class="metric-value">
            <strong>{toPersianDigits(formatPrice(pendingAmount))}</strong>
            <span class="unit">تومان</span>
          </div>
          <span class="metric-hint">{toPersianDigits(pendingCount)} فاکتور در انتظار تسویه</span>
        </div>
      </div>

      <div class="metric-card card-emerald">
        <div class="metric-icon">🧾</div>
        <div class="metric-content">
          <span class="metric-label">کل فاکتورها و پیش‌فاکتورها</span>
          <div class="metric-value">
            <strong>{toPersianDigits(invoices.length)}</strong>
            <span class="unit">فقره</span>
          </div>
          <span class="metric-hint">ثبت‌شده در سیستم مالی استودیو</span>
        </div>
      </div>

      <div class="metric-card card-indigo">
        <div class="metric-icon">✉️</div>
        <div class="metric-content">
          <span class="metric-label">نامه‌ها و قراردادهای رسمی</span>
          <div class="metric-value">
            <strong>{toPersianDigits(letters.length)}</strong>
            <span class="unit">سند</span>
          </div>
          <span class="metric-hint">شامل قراردادها و تاییدیه‌ها</span>
        </div>
      </div>
    </div>

    <!-- Tables Layout -->
    <div class="dashboard-tables-grid">
      <!-- Recent Invoices -->
      <div class="content-box">
        <div class="box-header">
          <h3>آخرین فاکتورها و پیش‌فاکتورها</h3>
          <button class="view-all-link" on:click={() => onNavigate('invoices')}>
            مشاهده همه ({toPersianDigits(invoices.length)}) &larr;
          </button>
        </div>

        {#if invoices.length === 0}
          <div class="empty-state">هنوز هیچ فاکتوری ثبت نشده است.</div>
        {:else}
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>خریدار / کارفرما</th>
                  <th>نوع</th>
                  <th>مبلغ کل</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {#each invoices.slice(0, 5) as inv}
                  <tr>
                    <td class="code-font">{toPersianDigits(inv.invoiceNumber)}</td>
                    <td>
                      <div class="client-cell">
                        <strong>{inv.buyerName}</strong>
                        {#if inv.buyerCompany}
                          <small>{inv.buyerCompany}</small>
                        {/if}
                      </div>
                    </td>
                    <td>
                      <span class="type-tag" class:proforma={inv.type === 'proforma'}>
                        {inv.type === 'proforma' ? 'پیش‌فاکتور' : 'فاکتور فروش'}
                      </span>
                    </td>
                    <td class="price-cell">
                      {toPersianDigits(formatPrice(inv.totalAmount))} تومان
                    </td>
                    <td>
                      <span class={`status-badge status-${inv.status}`}>
                        {#if inv.status === 'paid'}تسویه‌شده
                        {:else if inv.status === 'pending'}در انتظار پرداخت
                        {:else if inv.status === 'draft'}پیش‌نویس
                        {:else}لغوشده{/if}
                      </span>
                    </td>
                    <td>
                      <div class="row-actions">
                        <button class="action-btn print" title="چاپ و مشاهده رسمی" on:click={() => onNavigate('invoice-print', inv.id)}>
                          🖨️ چاپ
                        </button>
                        <button class="action-btn edit" title="ویرایش" on:click={() => onNavigate('invoice-edit', inv.id)}>
                          ✏️ ویرایش
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>

      <!-- Recent Letters -->
      <div class="content-box">
        <div class="box-header">
          <h3>نامه‌ها و قراردادهای اداری اخیر</h3>
          <button class="view-all-link" on:click={() => onNavigate('letters')}>
            مشاهده همه ({toPersianDigits(letters.length)}) &larr;
          </button>
        </div>

        {#if letters.length === 0}
          <div class="empty-state">هنوز هیچ نامه‌ای صادر نشده است.</div>
        {:else}
          <div class="letters-mini-list">
            {#each letters.slice(0, 4) as letItem}
              <div class="letter-mini-card">
                <div class="let-header">
                  <span class="let-number">{toPersianDigits(letItem.letterNumber)}</span>
                  <span class="let-date">{toPersianDigits(letItem.letterDate)}</span>
                </div>
                <h4 class="let-subject">{letItem.subject}</h4>
                <p class="let-recipient">گیرنده: {letItem.recipientTitle}</p>
                <div class="let-actions">
                  <button class="action-btn print" on:click={() => onNavigate('letter-print', letItem.id)}>
                    چاپ روی سربرگ A4 🖨️
                  </button>
                  <button class="action-btn edit" on:click={() => onNavigate('letter-edit', letItem.id)}>
                    ویرایش ✏️
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard-view {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-titles h2 {
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .header-titles p {
    font-size: 13.5px;
    color: #64748b;
  }

  .header-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .btn-primary {
    background: #1e40af;
    color: #ffffff;
  }
  .btn-primary:hover {
    background: #1e3a8a;
  }

  .btn-outline {
    background: #ffffff;
    color: #1e293b;
    border: 1px solid #cbd5e1;
  }
  .btn-outline:hover {
    background: #f8fafc;
  }

  .loading-state {
    padding: 60px;
    text-align: center;
    color: #64748b;
    background: #ffffff;
    border-radius: 16px;
  }

  /* Metrics */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  .metric-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .metric-icon {
    font-size: 28px;
    padding: 10px;
    background: #f8fafc;
    border-radius: 12px;
  }

  .metric-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .metric-label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
  }

  .metric-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
  }

  .metric-value .unit {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
  }

  .metric-hint {
    font-size: 11px;
    color: #94a3b8;
  }

  /* Content Boxes */
  .dashboard-tables-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 24px;
  }

  @media (max-width: 1024px) {
    .dashboard-tables-grid {
      grid-template-columns: 1fr;
    }
  }

  .content-box {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .box-header h3 {
    font-size: 16px;
    font-weight: 800;
    color: #1e293b;
  }

  .view-all-link {
    background: none;
    border: none;
    color: #1e40af;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
  }

  .view-all-link:hover {
    text-decoration: underline;
  }

  /* Data Table */
  .table-responsive {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: right;
  }

  .data-table th {
    padding: 10px 12px;
    background: #f8fafc;
    color: #475569;
    font-weight: 700;
    border-bottom: 1px solid #e2e8f0;
  }

  .data-table td {
    padding: 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
  }

  .code-font {
    font-family: inherit;
    font-weight: 700;
    color: #1e40af;
  }

  .client-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .client-cell small {
    color: #64748b;
    font-size: 11px;
  }

  .price-cell {
    font-weight: 700;
  }

  .type-tag {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 6px;
    background: #eff6ff;
    color: #1e40af;
    font-weight: 600;
  }

  .type-tag.proforma {
    background: #fffbeb;
    color: #d97706;
  }

  .status-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 9999px;
  }

  .status-paid { background: #ecfdf5; color: #059669; }
  .status-pending { background: #fffbeb; color: #d97706; }
  .status-draft { background: #f1f5f9; color: #64748b; }
  .status-cancelled { background: #fef2f2; color: #dc2626; }

  .row-actions {
    display: flex;
    gap: 6px;
  }

  .action-btn {
    padding: 4px 8px;
    font-size: 11.5px;
    font-weight: 600;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    cursor: pointer;
    font-family: inherit;
  }

  .action-btn.print {
    color: #1e40af;
    border-color: #bfdbfe;
    background: #eff6ff;
  }

  .action-btn.edit {
    color: #475569;
  }

  /* Letters mini list */
  .letters-mini-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .letter-mini-card {
    background: #fafbfc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .let-header {
    display: flex;
    justify-content: space-between;
    font-size: 11.5px;
    color: #64748b;
  }

  .let-number {
    font-weight: 700;
    color: #1e40af;
  }

  .let-subject {
    font-size: 13.5px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .let-recipient {
    font-size: 12px;
    color: #64748b;
    margin: 0;
  }

  .let-actions {
    display: flex;
    gap: 8px;
    margin-top: 6px;
  }

  .empty-state {
    padding: 36px;
    text-align: center;
    color: #94a3b8;
    font-size: 13px;
  }
</style>
