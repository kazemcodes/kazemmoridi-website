<script lang="ts">
  import { onMount } from 'svelte';
  import { getDatabase, type Invoice, type StudioProfile } from '../../services/db';
  import { numberToPersianWords, formatPrice } from '../../utils/numberToWords';
  import { toPersianDigits } from '../../utils/persianDigits';
  import { Printer, Edit3, ArrowRight } from 'lucide-svelte';

  export let invoiceId: string;
  export let onNavigate: (tab: string, param?: string) => void;

  let invoice: Invoice | null = null;
  let profile: StudioProfile | null = null;
  let loading = true;

  onMount(async () => {
    try {
      const db = getDatabase();
      const [inv, prof] = await Promise.all([
        db.getInvoiceById(invoiceId),
        db.getStudioProfile()
      ]);
      invoice = inv;
      profile = prof;
    } catch (e) {
      console.error('Failed to load invoice print data', e);
    } finally {
      loading = false;
    }
  });

  function handlePrint() {
    window.print();
  }
</script>

<div class="print-view-wrapper">
  <!-- Screen-Only Actions Header -->
  <div class="screen-controls no-print">
    <div class="controls-left">
      <button class="btn btn-outline" on:click={() => onNavigate('invoices')}>
        <ArrowRight size={16} />
        <span>بازگشت به لیست فاکتورها</span>
      </button>
      <button class="btn btn-outline" on:click={() => onNavigate('invoice-edit', invoiceId)}>
        <Edit3 size={16} />
        <span>ویرایش فاکتور</span>
      </button>
    </div>
    <div class="controls-right">
      <button class="btn btn-print" on:click={handlePrint}>
        <Printer size={16} />
        <span>چاپ فاکتور / ذخیره به عنوان PDF</span>
      </button>
    </div>
  </div>

  {#if loading}
    <div class="loading-box no-print">در حال آماده‌سازی سند برای چاپ...</div>
  {:else if !invoice}
    <div class="error-box no-print">فاکتور مورد نظر یافت نشد.</div>
  {:else}
    <!-- A4 Printable Sheet -->
    <div class="a4-sheet" id="invoice-sheet">
      <!-- 1. Header -->
      <header class="invoice-header">
        <div class="header-logo-brand">
          <div class="brand-badge">KM</div>
          <div class="brand-titles">
            <h1>{profile?.brandName || 'استودیو مریدی (KM Studio)'}</h1>
            <p>توسعه نرم‌افزار، طراحی وب‌سایت‌های مدرن و سامانه‌های اختصاصی</p>
          </div>
        </div>

        <div class="header-doc-title">
          <h2>{invoice.type === 'proforma' ? 'پیش‌فاکتور فروش کالا و خدمات' : 'صورتحساب رسمی فروش کالا و خدمات'}</h2>
          <span class="doc-badge">{invoice.type === 'proforma' ? 'پیش‌فاکتور رسمی' : 'فاکتور فروش'}</span>
        </div>

        <div class="header-meta">
          <div class="meta-row">
            <span>شماره سند:</span>
            <strong>{toPersianDigits(invoice.invoiceNumber)}</strong>
          </div>
          <div class="meta-row">
            <span>تاریخ صدور:</span>
            <strong>{toPersianDigits(invoice.issueDate)}</strong>
          </div>
          {#if invoice.dueDate}
            <div class="meta-row">
              <span>سررسید:</span>
              <strong>{toPersianDigits(invoice.dueDate)}</strong>
            </div>
          {/if}
          <div class="meta-row">
            <span>وضعیت:</span>
            <strong>
              {#if invoice.status === 'paid'}تسویه‌شده
              {:else if invoice.status === 'pending'}در انتظار پرداخت
              {:else if invoice.status === 'draft'}پیش‌نویس
              {:else}لغوشده{/if}
            </strong>
          </div>
        </div>
      </header>

      <!-- 2. Seller and Buyer Information Boxes -->
      <section class="parties-section">
        <!-- Seller -->
        <div class="party-box seller-box">
          <div class="party-title">مشخصات فروشنده / مجری طرح</div>
          <div class="party-grid">
            <div class="p-item">
              <span>نام / عنوان:</span>
              <strong>{profile?.managerName || 'کاظم مریدی'} ({profile?.brandName || 'استودیو مریدی'})</strong>
            </div>
            <div class="p-item">
              <span>کد اقتصادی:</span>
              <strong>{toPersianDigits(profile?.economicCode || '---')}</strong>
            </div>
            <div class="p-item">
              <span>کد / شناسه ملی:</span>
              <strong>{toPersianDigits(profile?.nationalId || '---')}</strong>
            </div>
            <div class="p-item">
              <span>شماره تماس:</span>
              <strong dir="ltr">{toPersianDigits(profile?.phoneDisplay || '۰۹۱۷ ۰۲۸ ۴۴۶۳')}</strong>
            </div>
            <div class="p-item full-width">
              <span>نشانی و دفتر فنی:</span>
              <strong>{profile?.address || 'هرمزگان، ایران'}</strong>
            </div>
          </div>
        </div>

        <!-- Buyer -->
        <div class="party-box buyer-box">
          <div class="party-title">مشخصات خریدار / کارفرما</div>
          <div class="party-grid">
            <div class="p-item">
              <span>نام شخص / مدیر:</span>
              <strong>{invoice.buyerName}</strong>
            </div>
            <div class="p-item">
              <span>نام شرکت / برند:</span>
              <strong>{invoice.buyerCompany || 'شخصی / بدون نام ثبتی'}</strong>
            </div>
            <div class="p-item">
              <span>شناسه / کد ملی:</span>
              <strong>{toPersianDigits(invoice.buyerNationalId || '---')}</strong>
            </div>
            <div class="p-item">
              <span>شماره تماس:</span>
              <strong dir="ltr">{toPersianDigits(invoice.buyerPhone || '---')}</strong>
            </div>
            <div class="p-item full-width">
              <span>نشانی پستی کارفرما:</span>
              <strong>{invoice.buyerAddress || 'ثبت نشده'}</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Subject Title -->
      <div class="project-title-bar">
        <span>موضوع فاکتور:</span>
        <strong>{invoice.title}</strong>
      </div>

      <!-- 4. Line Items Table -->
      <table class="print-items-table">
        <thead>
          <tr>
            <th style="width: 38px">ردیف</th>
            <th>شرح کالا یا خدمات ارائه‌شده</th>
            <th style="width: 55px">تعداد</th>
            <th style="width: 60px">واحد</th>
            <th style="width: 130px">مبلغ واحد (تومان)</th>
            <th style="width: 100px">تخفیف (تومان)</th>
            <th style="width: 140px">مبلغ کل (تومان)</th>
          </tr>
        </thead>
        <tbody>
          {#each invoice.items as item, idx}
            <tr>
              <td class="text-center">{toPersianDigits(idx + 1)}</td>
              <td class="item-desc">{item.description}</td>
              <td class="text-center">{toPersianDigits(item.quantity)}</td>
              <td class="text-center">{item.unit || 'مورد'}</td>
              <td class="text-left">{toPersianDigits(formatPrice(item.unitPrice))}</td>
              <td class="text-left">{item.discount > 0 ? toPersianDigits(formatPrice(item.discount)) : '۰'}</td>
              <td class="text-left item-total">{toPersianDigits(formatPrice(item.totalPrice))}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- 5. Totals & Words -->
      <section class="invoice-totals-section">
        <div class="totals-words-side">
          <div class="words-container">
            <span class="w-label">مبلغ قابل پرداخت به حروف:</span>
            <strong class="w-val">{numberToPersianWords(invoice.totalAmount)}</strong>
          </div>

          {#if profile?.shebaNumber || profile?.cardNumber}
            <div class="payment-details-box">
              <span class="pay-title">مشخصات حساب بانکی جهت واریز:</span>
              <div class="pay-grid">
                <div>
                  <span>بانک:</span>
                  <strong>{profile.bankName}</strong>
                </div>
                <div>
                  <span>صاحب حساب:</span>
                  <strong>{profile.managerName}</strong>
                </div>
                {#if profile.cardNumber}
                  <div class="full-pay">
                    <span>شماره کارت:</span>
                    <strong dir="ltr" class="code-txt">{toPersianDigits(profile.cardNumber)}</strong>
                  </div>
                {/if}
                {#if profile.shebaNumber}
                  <div class="full-pay">
                    <span>شماره شبا:</span>
                    <strong dir="ltr" class="code-txt">{profile.shebaNumber}</strong>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>

        <div class="totals-calc-side">
          <div class="tot-row">
            <span>مجموع ارزش خدمات:</span>
            <strong>{toPersianDigits(formatPrice(invoice.subtotal))} تومان</strong>
          </div>
          {#if invoice.discountAmount > 0}
            <div class="tot-row discount-row">
              <span>مجموع تخفیف‌ها:</span>
              <strong>- {toPersianDigits(formatPrice(invoice.discountAmount))} تومان</strong>
            </div>
          {/if}
          {#if invoice.taxAmount > 0}
            <div class="tot-row">
              <span>مالیات بر ارزش افزوده ({toPersianDigits(invoice.taxPercent)}٪):</span>
              <strong>+ {toPersianDigits(formatPrice(invoice.taxAmount))} تومان</strong>
            </div>
          {/if}
          <div class="tot-row final-row">
            <span>مبلغ نهایی قابل پرداخت:</span>
            <div class="final-val">
              <strong>{toPersianDigits(formatPrice(invoice.totalAmount))}</strong>
              <small>تومان</small>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Notes & Terms -->
      {#if invoice.notes || invoice.terms}
        <section class="invoice-notes-section">
          {#if invoice.notes}
            <div class="note-item">
              <strong>توضیحات:</strong>
              <p>{invoice.notes}</p>
            </div>
          {/if}
          {#if invoice.terms}
            <div class="note-item">
              <strong>شرایط و تعهدات:</strong>
              <p>{invoice.terms}</p>
            </div>
          {/if}
        </section>
      {/if}

      <!-- 7. Seals and Signatures -->
      <footer class="invoice-signatures">
        <div class="sig-box">
          <span>مهر و امضای فروشنده / مجری:</span>
          <div class="sig-placeholder">
            <strong class="sig-name">{profile?.managerName || 'کاظم مریدی'}</strong>
            <span class="sig-sub">استودیو مریدی (KM Studio)</span>
          </div>
        </div>

        <div class="sig-box">
          <span>مهر و امضای خریدار / کارفرما:</span>
          <div class="sig-placeholder">
            <strong class="sig-name">{invoice.buyerName}</strong>
            {#if invoice.buyerCompany}
              <span class="sig-sub">{invoice.buyerCompany}</span>
            {/if}
          </div>
        </div>
      </footer>
    </div>
  {/if}
</div>

<style>
  .print-view-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-bottom: 60px;
    direction: rtl;
  }

  /* Screen Controls */
  .screen-controls {
    width: 100%;
    max-width: 820px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .controls-left, .controls-right {
    display: flex;
    gap: 10px;
  }

  .btn {
    padding: 9px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
  }

  .btn-print {
    background: #1e40af;
    color: #ffffff;
    font-size: 14px;
  }
  .btn-print:hover { background: #1e3a8a; }

  .btn-outline {
    background: #ffffff;
    color: #334155;
    border: 1px solid #cbd5e1;
  }
  .btn-outline:hover { background: #f8fafc; }

  /* A4 Sheet Dimensions */
  .a4-sheet {
    width: 210mm;
    min-height: 297mm;
    padding: 15mm;
    background: #ffffff;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Vazirmatn', Tahoma, sans-serif;
    color: #0f172a;
    font-size: 12px;
    line-height: 1.5;
  }

  /* Header */
  .invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #1e40af;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }

  .header-logo-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-badge {
    width: 44px;
    height: 44px;
    background: #1e40af;
    color: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 18px;
  }

  .brand-titles h1 {
    font-size: 16px;
    font-weight: 900;
    color: #1e40af;
    margin: 0;
  }

  .brand-titles p {
    font-size: 10px;
    color: #64748b;
    margin: 2px 0 0 0;
  }

  .header-doc-title {
    text-align: center;
  }

  .header-doc-title h2 {
    font-size: 16px;
    font-weight: 900;
    color: #1e293b;
    margin: 0 0 4px 0;
  }

  .doc-badge {
    display: inline-block;
    padding: 2px 8px;
    background: #eff6ff;
    color: #1e40af;
    border: 1px solid #bfdbfe;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
  }

  .header-meta {
    font-size: 11px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .meta-row {
    display: flex;
    gap: 6px;
  }

  .meta-row span {
    color: #64748b;
  }

  /* Parties Section */
  .parties-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }

  .party-box {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
  }

  .party-title {
    background: #f1f5f9;
    padding: 4px 8px;
    font-weight: 800;
    font-size: 11.5px;
    color: #1e293b;
    border-bottom: 1px solid #cbd5e1;
  }

  .party-grid {
    padding: 6px 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 8px;
    font-size: 11px;
  }

  .p-item {
    display: flex;
    gap: 4px;
  }

  .p-item span {
    color: #64748b;
    flex-shrink: 0;
  }

  .p-item strong {
    color: #0f172a;
  }

  .full-width {
    grid-column: 1 / -1;
  }

  /* Project Bar */
  .project-title-bar {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 6px 10px;
    border-radius: 6px;
    margin-bottom: 10px;
    font-size: 12px;
    display: flex;
    gap: 8px;
  }

  .project-title-bar span {
    color: #64748b;
  }

  .project-title-bar strong {
    color: #1e40af;
  }

  /* Print Items Table */
  .print-items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    font-size: 11px;
  }

  .print-items-table th, .print-items-table td {
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
  }

  .print-items-table th {
    background: #f1f5f9;
    font-weight: 800;
    color: #1e293b;
    text-align: center;
  }

  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .item-desc { font-weight: 600; }
  .item-total { font-weight: 800; color: #0f172a; }

  /* Totals Section */
  .invoice-totals-section {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 12px;
    margin-bottom: 14px;
  }

  .words-container {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px 10px;
    margin-bottom: 8px;
    font-size: 11.5px;
  }

  .w-label {
    display: block;
    color: #64748b;
    font-size: 10.5px;
    margin-bottom: 2px;
  }

  .w-val {
    color: #1e40af;
  }

  .payment-details-box {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 10.5px;
  }

  .pay-title {
    font-weight: 800;
    color: #1e293b;
    display: block;
    margin-bottom: 4px;
  }

  .pay-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }

  .full-pay {
    grid-column: 1 / -1;
  }

  .code-txt {
    font-family: inherit;
    letter-spacing: 1px;
  }

  .totals-calc-side {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
  }

  .tot-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 10px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 11.5px;
  }

  .tot-row span { color: #475569; }
  .tot-row strong { color: #0f172a; font-weight: 700; }
  .discount-row strong { color: #dc2626; }

  .final-row {
    background: #eff6ff;
    border-bottom: none;
    padding: 8px 10px;
  }

  .final-row span {
    font-weight: 800;
    color: #1e40af;
  }

  .final-val {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .final-val strong {
    font-size: 15px;
    font-weight: 900;
    color: #1e40af;
  }

  /* Notes */
  .invoice-notes-section {
    border: 1px solid #e2e8f0;
    background: #fafbfc;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 14px;
    font-size: 10.5px;
  }

  .note-item {
    margin-bottom: 4px;
  }
  .note-item:last-child { margin-bottom: 0; }
  .note-item strong { color: #1e293b; }
  .note-item p { margin: 2px 0 0 0; color: #475569; }

  /* Signatures */
  .invoice-signatures {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding-top: 10px;
  }

  .sig-box {
    border-top: 1px dashed #94a3b8;
    padding-top: 8px;
    text-align: center;
  }

  .sig-box span {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    display: block;
    margin-bottom: 24px;
  }

  .sig-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .sig-name {
    font-size: 12px;
    font-weight: 800;
    color: #1e293b;
  }

  .sig-sub {
    font-size: 10px;
    color: #64748b;
  }

  /* Print Media Styles */
  @media print {
    body {
      background: #ffffff !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .no-print {
      display: none !important;
    }

    .print-view-wrapper {
      padding: 0 !important;
    }

    .a4-sheet {
      width: 100% !important;
      min-height: auto !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    @page {
      size: A4 portrait;
      margin: 12mm;
    }
  }

  .loading-box, .error-box {
    padding: 60px;
    text-align: center;
    color: #64748b;
  }
</style>
