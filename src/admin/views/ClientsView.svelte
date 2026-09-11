<script lang="ts">
  import { onMount } from 'svelte';
  import { getDatabase, type Client } from '../../services/db';
  import { toPersianDigits } from '../../utils/persianDigits';
  import { generateUUID, isValidUUID } from '../../utils/uuid';
  import { Plus, Edit3, Trash2, Users, X, Save } from 'lucide-svelte';

  let clients: Client[] = [];
  let loading = true;
  let showModal = false;
  let editingClient: Client = {
    id: '',
    name: '',
    company: '',
    phone: '',
    email: '',
    nationalId: '',
    economicCode: '',
    postalCode: '',
    address: ''
  };

  async function loadClients() {
    loading = true;
    try {
      const db = getDatabase();
      clients = await db.getClients();
    } catch (e) {
      console.error('Failed to load clients', e);
    } finally {
      loading = false;
    }
  }

  onMount(loadClients);

  function openCreateModal() {
    editingClient = {
      id: generateUUID(),
      name: '',
      company: '',
      phone: '',
      email: '',
      nationalId: '',
      economicCode: '',
      postalCode: '',
      address: ''
    };
    showModal = true;
  }

  function openEditModal(c: Client) {
    editingClient = { ...c };
    showModal = true;
  }

  async function handleSaveClient() {
    if (!editingClient.name.trim()) {
      alert('لطفاً نام مشتری را وارد نمایید.');
      return;
    }

    if (!isValidUUID(editingClient.id)) {
      editingClient.id = generateUUID();
    }

    try {
      const db = getDatabase();
      await db.saveClient(editingClient);
      await loadClients();
      showModal = false;
      alert('اطلاعات مشتری با موفقیت ذخیره شد.');
    } catch (e: any) {
      console.error('Failed to save client', e);
      const msg = e?.message || e?.details || 'خطا در ذخیره مشتری';
      alert(`خطا در ذخیره مشتری: ${msg}`);
    }
  }

  async function handleDeleteClient(id: string, name: string) {
    if (confirm(`آیا از حذف اطلاعات «${name}» مطمئن هستید؟`)) {
      try {
        const db = getDatabase();
        await db.deleteClient(id);
        clients = clients.filter(c => c.id !== id);
      } catch (e: any) {
        const msg = e?.message || 'خطا در حذف مشتری';
        alert(`خطا در حذف مشتری: ${msg}`);
      }
    }
  }
</script>

<div class="clients-view">
  <div class="view-header">
    <div class="header-titles">
      <h2>بانک مشتریان و کارفرمایان</h2>
      <p>مدیریت اطلاعات هویتی و ثبتی شرکت‌ها و اشخاص جهت درج خودکار در فاکتورها و نامه‌ها</p>
    </div>
    <div class="header-actions">
      <button class="btn btn-primary" on:click={openCreateModal}>
        <Plus size={16} />
        <span>افزودن مشتری جدید</span>
      </button>
    </div>
  </div>

  <div class="table-container">
    {#if loading}
      <div class="loading-state">در حال بارگذاری مشتریان...</div>
    {:else if clients.length === 0}
      <div class="empty-state">
        <span class="empty-icon-box">
          <Users size={48} />
        </span>
        <p>هنوز اطلاعات هیچ مشتری‌ای ثبت نشده است.</p>
        <button class="btn btn-primary" on:click={openCreateModal}>
          <Plus size={16} />
          <span>افزودن اولین مشتری</span>
        </button>
      </div>
    {:else}
      <table class="clients-table">
        <thead>
          <tr>
            <th>نام مشتری</th>
            <th>شرکت / برند</th>
            <th>شماره تماس</th>
            <th>کد / شناسه ملی</th>
            <th>کد پستی</th>
            <th>نشانی</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {#each clients as cl}
            <tr>
              <td><strong>{cl.name}</strong></td>
              <td>{cl.company || 'شخصی'}</td>
              <td dir="ltr" class="phone-cell">{toPersianDigits(cl.phone || '---')}</td>
              <td>{toPersianDigits(cl.nationalId || '---')}</td>
              <td>{toPersianDigits(cl.postalCode || '---')}</td>
              <td class="address-cell">{cl.address || 'ثبت نشده'}</td>
              <td>
                <div class="actions-group">
                  <button class="btn-action edit" on:click={() => openEditModal(cl)}>
                    <Edit3 size={13} />
                    <span>ویرایش</span>
                  </button>
                  <button class="btn-action delete" title="حذف مشتری" on:click={() => handleDeleteClient(cl.id, cl.name)}>
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

  <!-- Modal -->
  {#if showModal}
    <div class="modal-backdrop" on:click={() => showModal = false}></div>
    <div class="modal-card">
      <div class="modal-header">
        <h3>{editingClient.name ? 'ویرایش مشخصات مشتری' : 'ثبت مشتری جدید'}</h3>
        <button class="btn-close" on:click={() => showModal = false}>
          <X size={18} />
        </button>
      </div>

      <div class="modal-body">
        <div class="inputs-row">
          <div class="input-field flex-1">
            <label>نام و نام خانوادگی / مخاطب *</label>
            <input type="text" placeholder="مثال: مهندس کاظم مریدی" bind:value={editingClient.name} required />
          </div>
          <div class="input-field flex-1">
            <label>نام شرکت یا برند</label>
            <input type="text" placeholder="شرکت..." bind:value={editingClient.company} />
          </div>
        </div>

        <div class="inputs-row">
          <div class="input-field flex-1">
            <label>شماره تماس همراه</label>
            <input type="text" placeholder="۰۹۱۲۳۴۵۶۷۸۹" bind:value={editingClient.phone} />
          </div>
          <div class="input-field flex-1">
            <label>ایمیل</label>
            <input type="email" placeholder="example@domain.com" bind:value={editingClient.email} />
          </div>
        </div>

        <div class="inputs-row">
          <div class="input-field flex-1">
            <label>شناسه / کد ملی</label>
            <input type="text" placeholder="۱۰ یا ۱۱ رقمی" bind:value={editingClient.nationalId} />
          </div>
          <div class="input-field flex-1">
            <label>کد اقتصادی</label>
            <input type="text" placeholder="اختیاری" bind:value={editingClient.economicCode} />
          </div>
          <div class="input-field flex-1">
            <label>کد پستی</label>
            <input type="text" placeholder="۱۰ رقمی" bind:value={editingClient.postalCode} />
          </div>
        </div>

        <div class="input-field">
          <label>نشانی کامل</label>
          <input type="text" placeholder="استان، شهر، خیابان..." bind:value={editingClient.address} />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-outline" on:click={() => showModal = false}>انصراف</button>
        <button class="btn btn-primary" on:click={handleSaveClient}>
          <Save size={16} />
          <span>ذخیره اطلاعات مشتری</span>
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .clients-view {
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

  .btn-primary { background: #1e40af; color: #ffffff; }
  .btn-primary:hover { background: #1e3a8a; }

  .btn-outline { background: #ffffff; color: #475569; border: 1px solid #cbd5e1; }
  .btn-outline:hover { background: #f8fafc; }

  .table-container {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow-x: auto;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .clients-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: right;
  }

  .clients-table th {
    background: #f8fafc;
    padding: 12px 16px;
    font-weight: 700;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  .clients-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  .phone-cell {
    text-align: right;
    font-weight: 600;
  }

  .address-cell {
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #64748b;
  }

  .actions-group {
    display: flex;
    gap: 6px;
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
  }

  .btn-action.edit:hover { background: #f8fafc; }
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

  .empty-icon-box {
    color: var(--admin-text-muted);
    opacity: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    z-index: 100;
  }

  .modal-card {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    z-index: 101;
    overflow: hidden;
    direction: rtl;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    border-bottom: 1px solid #f1f5f9;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 800;
    color: #1e293b;
  }

  .btn-close {
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #64748b;
  }

  .modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 24px;
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
  }

  .inputs-row {
    display: flex;
    gap: 14px;
  }

  .flex-1 { flex: 1; }

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

  .input-field input {
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 13px;
    font-family: inherit;
    outline: none;
  }

  .input-field input:focus {
    border-color: #1e40af;
  }
</style>
