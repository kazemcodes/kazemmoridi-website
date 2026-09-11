<script lang="ts">
  export let activeTab: string = 'dashboard';
  export let onNavigate: (tab: string) => void;

  const navItems = [
    { id: 'dashboard', label: 'داشبورد و آمار کلی', icon: '📊' },
    { id: 'invoices', label: 'فاکتورها و پیش‌فاکتورها', icon: '🧾' },
    { id: 'letters', label: 'نامه‌ها و قراردادهای اداری', icon: '✉️' },
    { id: 'clients', label: 'بانک مشتریان و کارفرمایان', icon: '👥' },
    { id: 'settings', label: 'تنظیمات دیتابیس و مهر استودیو', icon: '⚙️' }
  ];
</script>

<aside class="admin-sidebar">
  <div class="sidebar-menu">
    {#each navItems as item}
      <button
        class="menu-item"
        class:active={activeTab === item.id || activeTab.startsWith(`${item.id}-`)}
        on:click={() => onNavigate(item.id)}
      >
        <span class="item-icon">{item.icon}</span>
        <span class="item-label">{item.label}</span>
      </button>
    {/each}
  </div>

  <div class="sidebar-footer">
    <div class="quick-create-card">
      <span class="qc-title">دسترسی سریع</span>
      <button class="qc-btn qc-invoice" on:click={() => onNavigate('invoice-new')}>
        + صدور فاکتور جدید
      </button>
      <button class="qc-btn qc-letter" on:click={() => onNavigate('letter-new')}>
        + نگارش نامه رسمی
      </button>
    </div>
  </div>
</aside>

<style>
  .admin-sidebar {
    width: 260px;
    background: #ffffff;
    border-left: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 14px;
    direction: rtl;
    min-height: calc(100vh - 64px);
  }

  .sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    background: transparent;
    border: none;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    color: #475569;
    cursor: pointer;
    text-align: right;
    width: 100%;
    transition: all 0.2s ease;
  }

  .menu-item:hover {
    background: #f8fafc;
    color: #1e293b;
  }

  .menu-item.active {
    background: #eff6ff;
    color: #1e40af;
    font-weight: 700;
  }

  .item-icon {
    font-size: 18px;
  }

  .sidebar-footer {
    padding-top: 20px;
    border-top: 1px solid #f1f5f9;
  }

  .quick-create-card {
    background: #fafbfc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .qc-title {
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 2px;
  }

  .qc-btn {
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    border: none;
    text-align: center;
    transition: all 0.2s ease;
  }

  .qc-invoice {
    background: #1e40af;
    color: #ffffff;
  }

  .qc-invoice:hover {
    background: #1e3a8a;
  }

  .qc-letter {
    background: #ffffff;
    color: #334155;
    border: 1px solid #cbd5e1;
  }

  .qc-letter:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
</style>
