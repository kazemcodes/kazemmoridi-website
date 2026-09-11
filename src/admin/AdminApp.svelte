<script lang="ts">
  import { onMount } from 'svelte';
  import AdminNavbar from './components/AdminNavbar.svelte';
  import AdminSidebar from './components/AdminSidebar.svelte';
  import DashboardView from './views/DashboardView.svelte';
  import InvoicesView from './views/InvoicesView.svelte';
  import InvoiceEditorView from './views/InvoiceEditorView.svelte';
  import InvoicePrintView from './views/InvoicePrintView.svelte';
  import LettersView from './views/LettersView.svelte';
  import LetterEditorView from './views/LetterEditorView.svelte';
  import LetterPrintView from './views/LetterPrintView.svelte';
  import ClientsView from './views/ClientsView.svelte';
  import SettingsView from './views/SettingsView.svelte';
  import AdminLoginView from './views/AdminLoginView.svelte';
  import { AuthService } from '../services/auth/auth.service';

  export let onExitAdmin: () => void;

  let activeTab: string = 'dashboard';
  let activeParam: string | null = null;
  let isAuthenticated = false;
  let checkingAuth = true;

  function parseRoute() {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    const hash = window.location.hash;

    // Check pathname first: /admin/tab/param
    if (path.startsWith('/admin')) {
      const parts = path.replace('/admin', '').split('/').filter(Boolean);
      if (parts.length > 0) {
        activeTab = parts[0];
        activeParam = parts[1] || null;
        return;
      } else {
        activeTab = 'dashboard';
        activeParam = null;
        return;
      }
    }

    // Fallback support for legacy hash if someone typed #/admin/...
    if (hash.startsWith('#/admin')) {
      const parts = hash.replace('#/admin', '').split('/').filter(Boolean);
      if (parts.length > 0) {
        activeTab = parts[0];
        activeParam = parts[1] || null;
        return;
      }
    }
  }

  async function checkAuthStatus() {
    checkingAuth = true;
    try {
      isAuthenticated = await AuthService.isAuthenticated();
    } catch {
      isAuthenticated = false;
    } finally {
      checkingAuth = false;
    }
  }

  onMount(() => {
    checkAuthStatus();
    parseRoute();
    window.addEventListener('popstate', parseRoute);
    window.addEventListener('hashchange', parseRoute);
    return () => {
      window.removeEventListener('popstate', parseRoute);
      window.removeEventListener('hashchange', parseRoute);
    };
  });

  function handleNavigate(tab: string, param?: string) {
    activeTab = tab;
    activeParam = param || null;
    if (typeof window !== 'undefined') {
      const cleanPath = param ? `/admin/${tab}/${param}` : (tab === 'dashboard' ? '/admin' : `/admin/${tab}`);
      window.history.pushState({}, '', cleanPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleLoginSuccess() {
    isAuthenticated = true;
    parseRoute();
  }

  async function handleLogout() {
    await AuthService.logout();
    isAuthenticated = false;
    activeTab = 'dashboard';
    activeParam = null;
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin');
    }
  }

  $: isPrintMode = activeTab === 'invoice-print' || activeTab === 'letter-print';
</script>

{#if checkingAuth}
  <div class="auth-loading-screen">
    <div class="spinner"></div>
    <p>در حال اعتبارسنجی نشست امنیتی...</p>
  </div>
{:else if !isAuthenticated}
  <AdminLoginView 
    onLoginSuccess={handleLoginSuccess} 
    onExit={onExitAdmin} 
  />
{:else}
  <div class="admin-app-root">
    {#if !isPrintMode}
      <AdminNavbar 
        {activeTab} 
        onNavigate={handleNavigate} 
        {onExitAdmin} 
        onLogout={handleLogout}
      />
    {/if}

    <div class="admin-body-layout" class:print-layout={isPrintMode}>
      {#if !isPrintMode}
        <AdminSidebar 
          {activeTab} 
          onNavigate={handleNavigate} 
        />
      {/if}

      <main class="admin-main-viewport" class:print-viewport={isPrintMode}>
        {#if activeTab === 'dashboard'}
          <DashboardView onNavigate={handleNavigate} />
        {:else if activeTab === 'invoices'}
          <InvoicesView onNavigate={handleNavigate} />
        {:else if activeTab === 'invoice-new'}
          <InvoiceEditorView invoiceId={null} onNavigate={handleNavigate} />
        {:else if activeTab === 'invoice-edit'}
          <InvoiceEditorView invoiceId={activeParam} onNavigate={handleNavigate} />
        {:else if activeTab === 'invoice-print' && activeParam}
          <InvoicePrintView invoiceId={activeParam} onNavigate={handleNavigate} />
        {:else if activeTab === 'letters'}
          <LettersView onNavigate={handleNavigate} />
        {:else if activeTab === 'letter-new'}
          <LetterEditorView letterId={null} onNavigate={handleNavigate} />
        {:else if activeTab === 'letter-edit'}
          <LetterEditorView letterId={activeParam} onNavigate={handleNavigate} />
        {:else if activeTab === 'letter-print' && activeParam}
          <LetterPrintView letterId={activeParam} onNavigate={handleNavigate} />
        {:else if activeTab === 'clients'}
          <ClientsView />
        {:else if activeTab === 'settings'}
          <SettingsView />
        {:else}
          <DashboardView onNavigate={handleNavigate} />
        {/if}
      </main>
    </div>
  </div>
{/if}

<style>
  .auth-loading-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0f172a;
    color: #ffffff;
    gap: 16px;
    font-family: var(--font-fa);
    direction: rtl;
  }

  .spinner {
    width: 44px;
    height: 44px;
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .admin-app-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    font-family: var(--font-fa);
    direction: rtl;
  }

  .admin-body-layout {
    display: flex;
    flex: 1;
  }

  .admin-body-layout.print-layout {
    display: block;
    background: #ffffff;
  }

  .admin-main-viewport {
    flex: 1;
    padding: 28px 32px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .admin-main-viewport.print-viewport {
    padding: 20px 0;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .admin-body-layout {
      flex-direction: column;
    }
    .admin-main-viewport {
      padding: 16px;
    }
  }
</style>
