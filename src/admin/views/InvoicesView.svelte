<script lang="ts">
  import { onMount } from 'svelte';
  import { getDatabase, type Invoice } from '../../services/db';
  import { formatPrice } from '../../utils/numberToWords';
  import { toPersianDigits } from '../../utils/persianDigits';
  import { generateInvoiceNumber } from '../../utils/persianDate';
  import { generateUUID } from '../../utils/uuid';
  import { Plus, Printer, Edit3, Copy, Trash2, FileText } from 'lucide-svelte';

  export let onNavigate: (tab: string, param?: string) => void;

  let invoices: Invoice[] = [];
  let loading = true;
  let searchQuery = '';
  let activeFilter: 'all' | 'invoice' | 'proforma' | 'paid' | 'pending' = 'all';

  async function loadInvoices() {
    loading = true;
    try {
      const db = getDatabase();
      invoices = await db.getInvoices();
    } catch (e) {
      console.error('Failed to load invoices', e);
    } finally {
      loading = false;
    }
  }

  onMount(loadInvoices);

  async function handleDelete(id: string, invoiceNumber: string) {
    if (confirm(`آیا از حذف فاکتور ${invoiceNumber} اطمینان دارید؟`)) {
      try {
        const db = getDatabase();
        await db.deleteInvoice(id);
        invoices = invoices.filter(i => i.id !== id);
      } catch (e: any) {
        const msg = e?.message || 'خطا در حذف فاکتور';
        alert(`خطا در حذف فاکتور: ${msg}`);
      }
    }
  }

  async function handleDuplicate(inv: Invoice) {
    try {
      const db = getDatabase();
      const newInv: Invoice = {
        ...inv,
        id: generateUUID(),
        invoiceNumber: generateInvoiceNumber(inv.type),
        title: `${inv.title} (کپی)`,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      await db.saveInvoice(newInv);
      invoices = [newInv, ...invoices];
      alert(`یک نسخه جدید با شماره ${newInv.invoiceNumber} ایجاد شد.`);
    } catch (e: any) {
      const msg = e?.message || 'خطا در کپی فاکتور';
      alert(`خطا در کپی فاکتور: ${msg}`);
    }
  }

  $: filteredInvoices = invoices.filter(inv => {
    // Tab filter
    if (activeFilter === 'invoice' && inv.type !== 'invoice') return false;
    if (activeFilter === 'proforma' && inv.type !== 'proforma') return false;
    if (activeFilter === 'paid' && inv.status !== 'paid') return false;
    if (activeFilter === 'pending' && inv.status !== 'pending') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
      const matchBuyer = inv.buyerName.toLowerCase().includes(q);
      const matchCompany = inv.buyerCompany?.toLowerCase().includes(q);
      const matchTitle = inv.title.toLowerCase().includes(q);
      return matchNum || matchBuyer || matchCompany || matchTitle;
    }

    return true;
  });
</script>

<div class="invoices-view">
  <div class="view-header">
    <div class="header-titles">
      <h2>فاکتورها و پیش‌فاکتورهای استودیو</h2>
      <p>صدور، مدیریت، چاپ رسمی و پیگیری وضعیت پرداخت پروژه‌ها</p>
    </div>
    <div class="header-actions">
      <button class="btn btn-primary" on:click={() => onNavigate('invoice-new')}>
        <Plus size={16} />
        <span>صدور فاکتور جدید</span>
      </button>
    </div>
  </div>

  <!-- Search and Filters Bar -->
  <div class="controls-bar">
    <div class="tabs-group">
      <button class="tab-btn" class:active={activeFilter === 'all'} on:click={() => activeFilter = 'all'}>
        همه ({toPersianDigits(invoices.length)})
      </button>
      <button class="tab-btn" class:active={activeFilter === 'invoice'} on:click={() => activeFilter = 'invoice'}>
        فاکتور فروش ({toPersianDigits(invoices.filter(i => i.type === 'invoice').length)})
      </button>
      <button class="tab-btn" class:active={activeFilter === 'proforma'} on:click={() => activeFilter = 'proforma'}>
        پیش‌فاکتور ({toPersianDigits(invoices.filter(i => i.type === 'proforma').length)})
      </button>
      <button class="tab-btn" class:active={activeFilter === 'paid'} on:click={() => activeFilter = 'paid'}>
        تسویه‌شده ({toPersianDigits(invoices.filter(i => i.status === 'paid').length)})
      </button>
      <button class="tab-btn" class:active={activeFilter === 'pending'} on:click={() => activeFilter = 'pending'}>
        در انتظار پرداخت ({toPersianDigits(invoices.filter(i => i.status === 'pending').length)})
      </button>
    </div>

    <div class="search-box">
      <input
        type="text"
        placeholder="جستجو بر اساس شماره، کارفرما، عنوان..."
        bind:value={searchQuery}
      />
    </div>
  </div>

  <!-- Invoices Table -->
  <div class="table-container">
    {#if loading}
      <div class="loading-state">در حال بارگذاری فاکتورها...</div>
    {:else if filteredInvoices.length === 0}
      <div class="empty-state">
        <span class="empty-icon-box">
          <FileText size={48} />
        </span>
        <p>هیچ فاکتوری با این مشخصات یافت نشد.</p>
        <button class="btn btn-primary" on:click={() => onNavigate('invoice-new')}>
          <Plus size={16} />
          <span>صدور اولین فاکتور</span>
        </button>
      </div>
    {:else}
      <table class="invoices-table">
        <thead>
          <tr>
            <th>شماره سند</th>
            <th>نوع سند</th>
            <th>عنوان پروژه</th>
            <th>کارفرما / خریدار</th>
            <th>تاریخ صدور</th>
            <th>مبلغ کل</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredInvoices as inv}
            <tr>
              <td class="inv-num">{toPersianDigits(inv.invoiceNumber)}</td>
              <td>
                <span class="type-pill" class:proforma={inv.type === 'proforma'}>
                  {inv.type === 'proforma' ? 'پیش‌فاکتور' : 'فاکتور فروش'}
                </span>
              </td>
              <td class="inv-title">
                <strong>{inv.title}</strong>
                <small>{toPersianDigits(inv.items.length)} ردیف کالا/خدمات</small>
              </td>
              <td>
                <div class="buyer-info">
                  <strong>{inv.buyerName}</strong>
                  {#if inv.buyerCompany}
                    <span>{inv.buyerCompany}</span>
                  {/if}
                </div>
              </td>
              <td>{toPersianDigits(inv.issueDate)}</td>
              <td class="price-cell">
                <strong>{toPersianDigits(formatPrice(inv.totalAmount))}</strong>
                <small>تومان</small>
              </td>
              <td>
                <span class={`status-pill status-${inv.status}`}>
                  {#if inv.status === 'paid'}تسویه‌شده
                  {:else if inv.status === 'pending'}در انتظار پرداخت
                  {:else if inv.status === 'draft'}پیش‌نویس
                  {:else}لغوشده{/if}
                </span>
              </td>
              <td>
                <div class="actions-group">
                  <button class="btn-action print" title="چاپ رسمی و دریافت PDF" on:click={() => onNavigate('invoice-print', inv.id)}>
                    <Printer size={13} />
                    <span>چاپ A4</span>
                  </button>
                  <button class="btn-action edit" title="ویرایش اطلاعات" on:click={() => onNavigate('invoice-edit', inv.id)}>
                    <Edit3 size={13} />
                    <span>ویرایش</span>
                  </button>
                  <button class="btn-action copy" title="تکثیر و صدور مجدد" on:click={() => handleDuplicate(inv)}>
                    <Copy size={13} />
                    <span>کپی</span>
                  </button>
                  <button class="btn-action delete" title="حذف فاکتور" on:click={() => handleDelete(inv.id, inv.invoiceNumber)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<style>
  .invoices-view {
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

  /* Controls */
  .controls-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    background: #ffffff;
    padding: 14px 18px;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
  }

  .tabs-group {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    border: 1px solid transparent;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .tab-btn:hover {
    background: #f8fafc;
    color: #1e293b;
  }

  .tab-btn.active {
    background: #eff6ff;
    color: #1e40af;
    border-color: #bfdbfe;
    font-weight: 700;
  }

  .search-box input {
    width: 280px;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 12.5px;
    font-family: inherit;
    outline: none;
  }

  .search-box input:focus {
    border-color: #1e40af;
  }

  /* Table */
  .table-container {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow-x: auto;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .invoices-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: right;
  }

  .invoices-table th {
    background: #f8fafc;
    padding: 12px 16px;
    font-weight: 700;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  .invoices-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  .inv-num {
    font-weight: 800;
    color: #1e40af;
    white-space: nowrap;
  }

  .type-pill {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    background: #eff6ff;
    color: #1e40af;
    white-space: nowrap;
  }

  .type-pill.proforma {
    background: #fffbeb;
    color: #d97706;
  }

  .inv-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .inv-title small {
    color: #94a3b8;
    font-size: 11px;
  }

  .buyer-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .buyer-info span {
    font-size: 11.5px;
    color: #64748b;
  }

  .price-cell {
    white-space: nowrap;
  }

  .price-cell strong {
    font-size: 14px;
    color: #1e293b;
    margin-left: 4px;
  }

  .price-cell small {
    color: #64748b;
    font-size: 11px;
  }

  .status-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 11.5px;
    font-weight: 700;
    white-space: nowrap;
  }

  .status-paid { background: #ecfdf5; color: #059669; }
  .status-pending { background: #fffbeb; color: #d97706; }
  .status-draft { background: #f1f5f9; color: #64748b; }
  .status-cancelled { background: #fef2f2; color: #dc2626; }

  .actions-group {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .btn-action {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    font-size: 11.5px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .btn-action.print {
    background: #eff6ff;
    color: #1e40af;
    border-color: #bfdbfe;
  }
  .btn-action.print:hover {
    background: #dbeafe;
  }

  .btn-action.edit:hover {
    background: #f8fafc;
  }

  .btn-action.copy:hover {
    background: #f8fafc;
  }

  .btn-action.delete {
    color: #dc2626;
  }
  .btn-action.delete:hover {
    background: #fef2f2;
    border-color: #fecaca;
  }

  .loading-state, .empty-state {
    padding: 60px;
    text-align: center;
    color: #64748b;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .empty-icon {
    font-size: 40px;
  }
</style>
