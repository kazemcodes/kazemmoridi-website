<script lang="ts">
  import { onMount } from 'svelte';
  import { getDatabase, type OfficialLetter } from '../../services/db';
  import { toPersianDigits } from '../../utils/persianDigits';
  import { generateLetterNumber } from '../../utils/persianDate';

  export let onNavigate: (tab: string, param?: string) => void;

  let letters: OfficialLetter[] = [];
  let loading = true;
  let searchQuery = '';
  let activeFilter: 'all' | 'contract' | 'official' | 'handover' = 'all';

  async function loadLetters() {
    loading = true;
    try {
      const db = getDatabase();
      letters = await db.getLetters();
    } catch (e) {
      console.error('Failed to load letters', e);
    } finally {
      loading = false;
    }
  }

  onMount(loadLetters);

  async function handleDelete(id: string, letterNumber: string) {
    if (confirm(`آیا از حذف نامه ${letterNumber} اطمینان دارید؟`)) {
      try {
        const db = getDatabase();
        await db.deleteLetter(id);
        letters = letters.filter(l => l.id !== id);
      } catch (e) {
        alert('خطا در حذف نامه');
      }
    }
  }

  async function handleDuplicate(item: OfficialLetter) {
    try {
      const db = getDatabase();
      const newLetter: OfficialLetter = {
        ...item,
        id: 'let-' + Date.now(),
        letterNumber: generateLetterNumber(),
        subject: `${item.subject} (رونوشت)`,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      await db.saveLetter(newLetter);
      letters = [newLetter, ...letters];
      alert(`یک نسخه رونوشت با شماره ${newLetter.letterNumber} ایجاد گردید.`);
    } catch (e) {
      alert('خطا در کپی نامه');
    }
  }

  $: filteredLetters = letters.filter(l => {
    if (activeFilter !== 'all' && l.type !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        l.letterNumber.toLowerCase().includes(q) ||
        l.subject.toLowerCase().includes(q) ||
        l.recipientTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });
</script>

<div class="letters-view">
  <div class="view-header">
    <div class="header-titles">
      <h2>نامه‌ها و قراردادهای رسمی استودیو</h2>
      <p>تنظیم، آرشیو و چاپ رسمی قراردادهای طراحی سایت و نامه‌های اداری بر روی سربرگ A4</p>
    </div>
    <div class="header-actions">
      <button class="btn btn-primary" on:click={() => onNavigate('letter-new')}>
        + نگارش نامه یا قرارداد جدید
      </button>
    </div>
  </div>

  <!-- Filters and Search -->
  <div class="controls-bar">
    <div class="tabs-group">
      <button class="tab-btn" class:active={activeFilter === 'all'} on:click={() => activeFilter = 'all'}>
        همه اسناد ({toPersianDigits(letters.length)})
      </button>
      <button class="tab-btn" class:active={activeFilter === 'contract'} on:click={() => activeFilter = 'contract'}>
        قراردادها ({toPersianDigits(letters.filter(l => l.type === 'contract').length)})
      </button>
      <button class="tab-btn" class:active={activeFilter === 'official'} on:click={() => activeFilter = 'official'}>
        نامه‌های رسمی ({toPersianDigits(letters.filter(l => l.type === 'official').length)})
      </button>
      <button class="tab-btn" class:active={activeFilter === 'handover'} on:click={() => activeFilter = 'handover'}>
        صورتجلسه تحویل ({toPersianDigits(letters.filter(l => l.type === 'handover').length)})
      </button>
    </div>

    <div class="search-box">
      <input
        type="text"
        placeholder="جستجو در موضوع، شماره نامه، گیرنده..."
        bind:value={searchQuery}
      />
    </div>
  </div>

  <!-- Letters Grid/Table -->
  <div class="table-container">
    {#if loading}
      <div class="loading-state">در حال بارگذاری نامه‌ها...</div>
    {:else if filteredLetters.length === 0}
      <div class="empty-state">
        <span class="empty-icon">✉️</span>
        <p>هیچ نامه‌ای با این مشخصات ثبت نشده است.</p>
        <button class="btn btn-primary" on:click={() => onNavigate('letter-new')}>
          نگارش اولین نامه رسمی
        </button>
      </div>
    {:else}
      <table class="letters-table">
        <thead>
          <tr>
            <th>شماره اندیکاتور</th>
            <th>نوع سند</th>
            <th>موضوع نامه / قرارداد</th>
            <th>گیرنده و مخاطب</th>
            <th>تاریخ صدور</th>
            <th>امضاکننده</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredLetters as letItem}
            <tr>
              <td class="let-num">{toPersianDigits(letItem.letterNumber)}</td>
              <td>
                <span class="type-pill type-{letItem.type}">
                  {#if letItem.type === 'contract'}قرارداد رسمی
                  {:else if letItem.type === 'handover'}صورتجلسه تحویل
                  {:else if letItem.type === 'recommendation'}معرفی‌نامه
                  {:else}نامه رسمی اداری{/if}
                </span>
              </td>
              <td class="let-title">
                <strong>{letItem.subject}</strong>
                {#if letItem.attachment && letItem.attachment !== 'ندارد'}
                  <small>پیوست: {letItem.attachment}</small>
                {/if}
              </td>
              <td>{letItem.recipientTitle}</td>
              <td>{toPersianDigits(letItem.letterDate)}</td>
              <td>
                <span class="signee-txt">{letItem.signeeName}</span>
              </td>
              <td>
                <div class="actions-group">
                  <button class="btn-action print" title="چاپ بر روی سربرگ A4" on:click={() => onNavigate('letter-print', letItem.id)}>
                    🖨️ چاپ سربرگ
                  </button>
                  <button class="btn-action edit" title="ویرایش نامه" on:click={() => onNavigate('letter-edit', letItem.id)}>
                    ✏️ ویرایش
                  </button>
                  <button class="btn-action copy" title="رونوشت نامه" on:click={() => handleDuplicate(letItem)}>
                    📋 رونوشت
                  </button>
                  <button class="btn-action delete" title="حذف" on:click={() => handleDelete(letItem.id, letItem.letterNumber)}>
                    🗑️
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
  .letters-view {
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

  .letters-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: right;
  }

  .letters-table th {
    background: #f8fafc;
    padding: 12px 16px;
    font-weight: 700;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  .letters-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  .let-num {
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
    white-space: nowrap;
  }

  .type-contract { background: #eff6ff; color: #1e40af; }
  .type-official { background: #f1f5f9; color: #334155; }
  .type-handover { background: #ecfdf5; color: #059669; }
  .type-recommendation { background: #fffbeb; color: #d97706; }

  .let-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .let-title small {
    color: #94a3b8;
    font-size: 11px;
  }

  .signee-txt {
    font-weight: 600;
    color: #334155;
  }

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

  .btn-action.edit:hover { background: #f8fafc; }
  .btn-action.copy:hover { background: #f8fafc; }

  .btn-action.delete { color: #dc2626; }
  .btn-action.delete:hover { background: #fef2f2; border-color: #fecaca; }

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

  .empty-icon { font-size: 40px; }
</style>
