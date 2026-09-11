<script lang="ts">
  import { onMount } from 'svelte';
  import { getDatabase, type Invoice, type InvoiceItem, type Client } from '../../services/db';
  import { getTodayPersianDate, generateInvoiceNumber } from '../../utils/persianDate';
  import { numberToPersianWords, formatPrice } from '../../utils/numberToWords';
  import { toPersianDigits } from '../../utils/persianDigits';

  export let invoiceId: string | null = null;
  export let onNavigate: (tab: string, param?: string) => void;

  let clients: Client[] = [];
  let loading = true;
  let saving = false;

  let invoice: Invoice = {
    id: 'inv-' + Date.now(),
    invoiceNumber: generateInvoiceNumber('invoice'),
    type: 'invoice',
    title: '',
    buyerName: '',
    buyerCompany: '',
    buyerNationalId: '',
    buyerEconomicCode: '',
    buyerPhone: '',
    buyerPostalCode: '',
    buyerAddress: '',
    issueDate: getTodayPersianDate(),
    dueDate: '',
    status: 'pending',
    subtotal: 0,
    discountAmount: 0,
    taxPercent: 0,
    taxAmount: 0,
    totalAmount: 0,
    paymentMethod: 'واریز به حساب / کارت به کارت',
    notes: 'پروژه مطابق استانداردهای مهندسی نرم‌افزار و توافقات انجام‌شده پیاده‌سازی و تحویل می‌گردد.',
    terms: 'تسویه نهایی پس از تایید فاز اول کدنویسی.',
    items: [
      {
        id: 'item-1',
        description: '',
        quantity: 1,
        unit: 'مورد',
        unitPrice: 0,
        discount: 0,
        totalPrice: 0
      }
    ]
  };

  onMount(async () => {
    try {
      const db = getDatabase();
      clients = await db.getClients();

      if (invoiceId) {
        const existing = await db.getInvoiceById(invoiceId);
        if (existing) {
          invoice = existing;
        }
      }
    } catch (e) {
      console.error('Failed to load invoice editor data', e);
    } finally {
      loading = false;
    }
  });

  function handleClientSelect(e: Event) {
    const clientId = (e.target as HTMLSelectElement).value;
    if (!clientId) return;
    const cl = clients.find(c => c.id === clientId);
    if (cl) {
      invoice.clientId = cl.id;
      invoice.buyerName = cl.name;
      invoice.buyerCompany = cl.company || '';
      invoice.buyerNationalId = cl.nationalId || '';
      invoice.buyerEconomicCode = cl.economicCode || '';
      invoice.buyerPhone = cl.phone || '';
      invoice.buyerPostalCode = cl.postalCode || '';
      invoice.buyerAddress = cl.address || '';
    }
  }

  function handleTypeChange(newType: 'invoice' | 'proforma') {
    invoice.type = newType;
    if (!invoiceId) {
      invoice.invoiceNumber = generateInvoiceNumber(newType);
    }
  }

  function addItem() {
    invoice.items = [
      ...invoice.items,
      {
        id: 'item-' + Date.now(),
        description: '',
        quantity: 1,
        unit: 'مورد',
        unitPrice: 0,
        discount: 0,
        totalPrice: 0
      }
    ];
  }

  function removeItem(index: number) {
    if (invoice.items.length <= 1) return;
    invoice.items = invoice.items.filter((_, idx) => idx !== index);
    calculateTotals();
  }

  function calculateTotals() {
    let sub = 0;
    let disc = 0;

    invoice.items = invoice.items.map(item => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unitPrice) || 0;
      const d = Number(item.discount) || 0;
      const total = Math.max(0, (q * p) - d);
      sub += (q * p);
      disc += d;
      return { ...item, totalPrice: total };
    });

    invoice.subtotal = sub;
    invoice.discountAmount = disc;

    const taxable = Math.max(0, sub - disc);
    const tax = Math.round((taxable * (Number(invoice.taxPercent) || 0)) / 100);
    invoice.taxAmount = tax;
    invoice.totalAmount = taxable + tax;
  }

  $: {
    invoice.taxPercent;
    invoice.items;
    calculateTotals();
  }

  async function handleSave(andPrint = false) {
    if (!invoice.title.trim()) {
      alert('لطفاً عنوان فاکتور یا پروژه را وارد کنید.');
      return;
    }
    if (!invoice.buyerName.trim()) {
      alert('لطفاً نام خریدار / کارفرما را مشخص فرمایید.');
      return;
    }

    saving = true;
    try {
      const db = getDatabase();
      await db.saveInvoice(invoice);
      alert('فاکتور با موفقیت ذخیره شد.');
      if (andPrint) {
        onNavigate('invoice-print', invoice.id);
      } else {
        onNavigate('invoices');
      }
    } catch (e) {
      console.error('Failed to save invoice', e);
      alert('خطا در ذخیره فاکتور');
    } finally {
      saving = false;
    }
  }
</script>

<div class="editor-view">
  <div class="view-header">
    <div class="header-titles">
      <h2>{invoiceId ? 'ویرایش سند مالی' : 'صدور سند مالی جدید'}</h2>
      <p>تنظیم مشخصات کارفرما، ردیف‌های خدمات، مبالغ و شرایط تسویه</p>
    </div>
    <div class="header-actions">
      <button class="btn btn-outline" on:click={() => onNavigate('invoices')}>
        انصراف و بازگشت
      </button>
      <button class="btn btn-secondary" disabled={saving} on:click={() => handleSave(true)}>
        ذخیره و مشاهده نسخه چاپ 🖨️
      </button>
      <button class="btn btn-primary" disabled={saving} on:click={() => handleSave(false)}>
        {saving ? 'در حال ذخیره...' : 'ذخیره فاکتور'}
      </button>
    </div>
  </div>

  {#if loading}
    <div class="loading-state">در حال بارگذاری فرم...</div>
  {:else}
    <div class="editor-grid">
      <!-- Left / Main Form -->
      <div class="form-main">
        <!-- 1. Document Identity -->
        <div class="form-card">
          <div class="card-header">
            <h3>۱. نوع و مشخصات سند</h3>
          </div>

          <div class="type-selector-row">
            <button
              type="button"
              class="type-btn"
              class:selected={invoice.type === 'invoice'}
              on:click={() => handleTypeChange('invoice')}
            >
              <strong>🧾 فاکتور فروش رسمی</strong>
              <small>سند مالی نهایی خدمات تحویل‌شده</small>
            </button>
            <button
              type="button"
              class="type-btn"
              class:selected={invoice.type === 'proforma'}
              on:click={() => handleTypeChange('proforma')}
            >
              <strong>📋 پیش‌فاکتور (Proforma)</strong>
              <small>پیشنهاد قیمت و برآورد رسمی به کارفرما</small>
            </button>
          </div>

          <div class="inputs-row">
            <div class="input-field flex-2">
              <label>عنوان فاکتور / پروژه *</label>
              <input
                type="text"
                placeholder="مثال: فاکتور طراحی و پیاده‌سازی وب‌سایت فروشگاهی کالاخش"
                bind:value={invoice.title}
              />
            </div>
            <div class="input-field flex-1">
              <label>شماره سند</label>
              <input type="text" bind:value={invoice.invoiceNumber} />
            </div>
            <div class="input-field flex-1">
              <label>وضعیت سند</label>
              <select bind:value={invoice.status}>
                <option value="pending">در انتظار پرداخت</option>
                <option value="paid">تسویه‌شده و پرداخت‌شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="cancelled">لغوشده</option>
              </select>
            </div>
          </div>

          <div class="inputs-row">
            <div class="input-field flex-1">
              <label>تاریخ صدور (شمسی)</label>
              <input type="text" placeholder="۱۴۰۴/۰۶/۲۰" bind:value={invoice.issueDate} />
            </div>
            <div class="input-field flex-1">
              <label>مهلت پرداخت / سررسید (اختیاری)</label>
              <input type="text" placeholder="۱۴۰۴/۰۶/۳۰" bind:value={invoice.dueDate} />
            </div>
            <div class="input-field flex-2">
              <label>روش پرداخت پیشنهادی</label>
              <input
                type="text"
                placeholder="کارت به کارت / حواله پایا / ساتنا"
                bind:value={invoice.paymentMethod}
              />
            </div>
          </div>
        </div>

        <!-- 2. Buyer Info -->
        <div class="form-card">
          <div class="card-header">
            <div class="card-header-between">
              <h3>۲. مشخصات خریدار / کارفرما</h3>
              {#if clients.length > 0}
                <div class="client-preset">
                  <span>انتخاب از مشتریان ثبت‌شده:</span>
                  <select on:change={handleClientSelect}>
                    <option value="">-- انتخاب مشتری --</option>
                    {#each clients as cl}
                      <option value={cl.id}>{cl.name} ({cl.company || 'شخصی'})</option>
                    {/each}
                  </select>
                </div>
              {/if}
            </div>
          </div>

          <div class="inputs-row">
            <div class="input-field flex-1">
              <label>نام و نام خانوادگی خریدار *</label>
              <input type="text" placeholder="نام شخص یا مدیرعامل" bind:value={invoice.buyerName} />
            </div>
            <div class="input-field flex-1">
              <label>نام شرکت یا فروشگاه (اختیاری)</label>
              <input type="text" placeholder="نام برند یا شرکت" bind:value={invoice.buyerCompany} />
            </div>
            <div class="input-field flex-1">
              <label>شماره تماس همراه</label>
              <input type="text" placeholder="۰۹۱۲۳۴۵۶۷۸۹" bind:value={invoice.buyerPhone} />
            </div>
          </div>

          <div class="inputs-row">
            <div class="input-field flex-1">
              <label>کد ملی / شناسه ملی</label>
              <input type="text" placeholder="۱۰ یا ۱۱ رقمی" bind:value={invoice.buyerNationalId} />
            </div>
            <div class="input-field flex-1">
              <label>کد اقتصادی</label>
              <input type="text" placeholder="اختیاری" bind:value={invoice.buyerEconomicCode} />
            </div>
            <div class="input-field flex-1">
              <label>کد پستی</label>
              <input type="text" placeholder="۱۰ رقمی" bind:value={invoice.buyerPostalCode} />
            </div>
          </div>

          <div class="input-field">
            <label>نشانی پستی کارفرما</label>
            <input type="text" placeholder="استان، شهر، خیابان..." bind:value={invoice.buyerAddress} />
          </div>
        </div>

        <!-- 3. Line Items -->
        <div class="form-card">
          <div class="card-header card-header-between">
            <h3>۳. اقلام کالا و خدمات</h3>
            <button type="button" class="btn-add-item" on:click={addItem}>
              + افزودن ردیف خدمات جدید
            </button>
          </div>

          <div class="items-table-wrapper">
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 40px">#</th>
                  <th>شرح کالا یا خدمات</th>
                  <th style="width: 80px">تعداد</th>
                  <th style="width: 90px">واحد</th>
                  <th style="width: 150px">قیمت واحد (تومان)</th>
                  <th style="width: 110px">تخفیف (تومان)</th>
                  <th style="width: 150px">مبلغ کل (تومان)</th>
                  <th style="width: 50px">حذف</th>
                </tr>
              </thead>
              <tbody>
                {#each invoice.items as item, index}
                  <tr>
                    <td class="row-index">{toPersianDigits(index + 1)}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="شرح خدمات یا ماژول نرم‌افزاری..."
                        bind:value={item.description}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        bind:value={item.quantity}
                        on:input={calculateTotals}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="پروژه/ماژول"
                        bind:value={item.unit}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="100000"
                        bind:value={item.unitPrice}
                        on:input={calculateTotals}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="50000"
                        bind:value={item.discount}
                        on:input={calculateTotals}
                      />
                    </td>
                    <td class="item-total-col">
                      {toPersianDigits(formatPrice(item.totalPrice))}
                    </td>
                    <td>
                      <button
                        type="button"
                        class="btn-del-item"
                        disabled={invoice.items.length <= 1}
                        on:click={() => removeItem(index)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. Notes & Conditions -->
        <div class="form-card">
          <div class="card-header">
            <h3>۴. شرایط، توضیحات و تعهدات قرارداد</h3>
          </div>
          <div class="inputs-row">
            <div class="input-field flex-1">
              <label>توضیحات تکمیلی سند</label>
              <textarea rows="3" bind:value={invoice.notes}></textarea>
            </div>
            <div class="input-field flex-1">
              <label>شرایط تحویل، گارانتی و پشتیبانی</label>
              <textarea rows="3" bind:value={invoice.terms}></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Summary Sticky Box -->
      <div class="form-sidebar">
        <div class="summary-sticky-card">
          <h4>خلاصه مالی سند</h4>

          <div class="sum-row">
            <span>جمع اقلام خدمات:</span>
            <strong>{toPersianDigits(formatPrice(invoice.subtotal))} تومان</strong>
          </div>

          <div class="sum-row text-red">
            <span>مجموع تخفیف‌ها:</span>
            <strong>- {toPersianDigits(formatPrice(invoice.discountAmount))} تومان</strong>
          </div>

          <div class="tax-config-box">
            <div class="tax-row">
              <label>مالیات بر ارزش افزوده (VAT):</label>
              <div class="tax-input-group">
                <input
                  type="number"
                  min="0"
                  max="50"
                  bind:value={invoice.taxPercent}
                  on:input={calculateTotals}
                />
                <span>٪</span>
              </div>
            </div>
            {#if invoice.taxPercent > 0}
              <div class="sum-row text-tax">
                <span>مبلغ مالیات:</span>
                <strong>+ {toPersianDigits(formatPrice(invoice.taxAmount))} تومان</strong>
              </div>
            {/if}
          </div>

          <div class="total-callout">
            <span class="total-label">مبلغ نهایی و قابل پرداخت:</span>
            <div class="total-number">
              <span>{toPersianDigits(formatPrice(invoice.totalAmount))}</span>
              <small>تومان</small>
            </div>
          </div>

          <div class="words-box">
            <span class="words-title">مبلغ به حروف:</span>
            <p class="words-text">{numberToPersianWords(invoice.totalAmount)}</p>
          </div>

          <div class="sidebar-actions">
            <button class="btn btn-primary w-full" disabled={saving} on:click={() => handleSave(false)}>
              {saving ? 'در حال ذخیره...' : 'ذخیره فاکتور'}
            </button>
            <button class="btn btn-secondary w-full" disabled={saving} on:click={() => handleSave(true)}>
              ذخیره و پیش‌نمایش چاپ A4 🖨️
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .editor-view {
    display: flex;
    flex-direction: column;
    gap: 24px;
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

  .btn-primary { background: #1e40af; color: #ffffff; }
  .btn-primary:hover { background: #1e3a8a; }

  .btn-secondary { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
  .btn-secondary:hover { background: #dbeafe; }

  .btn-outline { background: #ffffff; color: #475569; border: 1px solid #cbd5e1; }
  .btn-outline:hover { background: #f8fafc; }

  .editor-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    align-items: flex-start;
  }

  @media (max-width: 1080px) {
    .editor-grid {
      grid-template-columns: 1fr;
    }
  }

  .form-main {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .card-header {
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f5f9;
  }

  .card-header h3 {
    font-size: 15px;
    font-weight: 800;
    color: #1e293b;
  }

  .card-header-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .client-preset {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #64748b;
  }

  .client-preset select {
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    font-family: inherit;
    font-size: 12px;
  }

  /* Type selector */
  .type-selector-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .type-btn {
    padding: 14px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    background: #fafbfc;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .type-btn:hover {
    border-color: #cbd5e1;
  }

  .type-btn.selected {
    border-color: #1e40af;
    background: #eff6ff;
  }

  .type-btn strong {
    font-size: 14px;
    color: #1e293b;
  }

  .type-btn small {
    font-size: 11.5px;
    color: #64748b;
  }

  /* Inputs */
  .inputs-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .flex-1 { flex: 1; min-width: 200px; }
  .flex-2 { flex: 2; min-width: 280px; }

  .input-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-field label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
  }

  .input-field input, .input-field select, .input-field textarea {
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 13px;
    font-family: inherit;
    background: #ffffff;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .input-field input:focus, .input-field select:focus, .input-field textarea:focus {
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.08);
  }

  /* Items Table */
  .items-table-wrapper {
    overflow-x: auto;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: right;
  }

  .items-table th {
    background: #f8fafc;
    padding: 10px 8px;
    color: #475569;
    font-weight: 700;
    border-bottom: 1px solid #e2e8f0;
  }

  .items-table td {
    padding: 8px;
    border-bottom: 1px solid #f1f5f9;
  }

  .items-table input {
    width: 100%;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    font-size: 12.5px;
    font-family: inherit;
  }

  .row-index {
    text-align: center;
    font-weight: 700;
    color: #94a3b8;
  }

  .item-total-col {
    font-weight: 800;
    color: #1e293b;
    white-space: nowrap;
  }

  .btn-add-item {
    background: #eff6ff;
    color: #1e40af;
    border: 1px solid #bfdbfe;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
  }

  .btn-del-item {
    background: transparent;
    border: none;
    color: #dc2626;
    font-weight: 700;
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
  }

  .btn-del-item:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* Sidebar Summary */
  .summary-sticky-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 88px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  }

  .summary-sticky-card h4 {
    font-size: 16px;
    font-weight: 800;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 10px;
    margin: 0;
  }

  .sum-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #475569;
  }

  .sum-row strong {
    font-weight: 700;
    color: #1e293b;
  }

  .text-red strong { color: #dc2626; }
  .text-tax strong { color: #059669; }

  .tax-config-box {
    background: #fafbfc;
    border-radius: 10px;
    padding: 12px;
    border: 1px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tax-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #475569;
  }

  .tax-input-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .tax-input-group input {
    width: 50px;
    padding: 4px 6px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    text-align: center;
    font-family: inherit;
    font-size: 12px;
  }

  .total-callout {
    background: #1e40af;
    color: #ffffff;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
  }

  .total-label {
    font-size: 12px;
    opacity: 0.9;
    display: block;
    margin-bottom: 4px;
  }

  .total-number {
    font-size: 24px;
    font-weight: 900;
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 6px;
  }

  .total-number small {
    font-size: 13px;
    font-weight: 600;
  }

  .words-box {
    background: #f8fafc;
    border-radius: 10px;
    padding: 12px;
    border: 1px solid #e2e8f0;
  }

  .words-title {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    display: block;
    margin-bottom: 4px;
  }

  .words-text {
    font-size: 12.5px;
    font-weight: 700;
    color: #1e40af;
    margin: 0;
    line-height: 1.6;
  }

  .sidebar-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .w-full {
    width: 100%;
  }

  .loading-state {
    padding: 60px;
    text-align: center;
    color: #64748b;
  }
</style>
