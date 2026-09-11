<script lang="ts">
  import { getDatabaseCredentials } from '../../services/db';

  export let activeTab: string = 'dashboard';
  export let onNavigate: (tab: string) => void;
  export let onExitAdmin: () => void;
  export let onLogout: () => void;

  const { isConfigured } = getDatabaseCredentials();
</script>

<header class="admin-navbar">
  <div class="navbar-brand">
    <div class="brand-logo">KM</div>
    <div class="brand-info">
      <span class="brand-title">پنل مدیریت استودیو مریدی</span>
      <span class="brand-subtitle">سیستم صدور فاکتور رسمی و مکاتبات اداری</span>
    </div>
  </div>

  <div class="navbar-center">
    <div class="db-badge" class:supabase={isConfigured} class:local={!isConfigured}>
      <span class="badge-dot"></span>
      {#if isConfigured}
        دیتابیس ابری: Supabase (متصل)
      {:else}
        دیتابیس: LocalStorage (حالت آفلاین)
      {/if}
    </div>
  </div>

  <div class="navbar-actions">
    <button class="nav-btn settings-btn" on:click={() => onNavigate('settings')}>
      تنظیمات دیتابیس و استودیو
    </button>
    <button class="nav-btn exit-btn" on:click={onExitAdmin} title="مشاهده سایت عمومی">
      سایت عمومی ↗
    </button>
    <button class="nav-btn logout-btn" on:click={onLogout} title="خروج امن از پنل مدیریت">
      خروج از حساب 🚪
    </button>
  </div>
</header>

<style>
  .admin-navbar {
    height: 64px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    position: sticky;
    top: 0;
    z-index: 50;
    direction: rtl;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-logo {
    width: 36px;
    height: 36px;
    background: #1e40af;
    color: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 14px;
    letter-spacing: 1px;
  }

  .brand-info {
    display: flex;
    flex-direction: column;
  }

  .brand-title {
    font-size: 14px;
    font-weight: 800;
    color: #1e293b;
  }

  .brand-subtitle {
    font-size: 11px;
    color: #64748b;
  }

  .navbar-center {
    display: flex;
    align-items: center;
  }

  .db-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 9999px;
  }

  .db-badge.supabase {
    background: #ecfdf5;
    color: #059669;
    border: 1px solid #a7f3d0;
  }

  .db-badge.local {
    background: #eff6ff;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-btn {
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .settings-btn {
    background: #f1f5f9;
    color: #334155;
  }

  .settings-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .exit-btn {
    background: #f1f5f9;
    color: #334155;
  }

  .exit-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .logout-btn {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .logout-btn:hover {
    background: #fee2e2;
  }

  @media (max-width: 768px) {
    .navbar-center {
      display: none;
    }
    .brand-subtitle {
      display: none;
    }
  }
</style>
