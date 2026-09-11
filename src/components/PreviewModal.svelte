<script lang="ts">
  import { onMount } from 'svelte';
  import type { Project } from '../data/projects';

  export let isOpen = false;
  export let project: Project | null = null;
  export let onClose: () => void;

  let deviceMode: 'desktop' | 'mobile' = 'desktop';
  let iframeLoading = true;
  let iframeError = false;

  $: if (project) {
    iframeLoading = true;
    iframeError = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  function handleIframeLoad() {
    iframeLoading = false;
  }

  function handleIframeError() {
    iframeLoading = false;
    iframeError = true;
  }
</script>

{#if isOpen && project}
  <div class="modal-wrapper">
    <button class="modal-backdrop" on:click={onClose} aria-label="بستن پیش‌نمایش"></button>
    <div class="modal-container animate-fade-in" role="dialog" aria-modal="true">
      <!-- Modal Browser Header -->
      <div class="modal-browser-header">
        <div class="browser-controls-left">
          <div class="browser-dots">
            <button class="dot dot-red" on:click={onClose} title="بستن"></button>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>

          <!-- Device Switcher -->
          <div class="device-switcher">
            <button 
              class="device-btn" 
              class:active={deviceMode === 'desktop'} 
              on:click={() => deviceMode = 'desktop'}
              title="نمای دسکتاپ"
            >
              دسکتاپ
            </button>
            <button 
              class="device-btn" 
              class:active={deviceMode === 'mobile'} 
              on:click={() => deviceMode = 'mobile'}
              title="نمای موبایل"
            >
              موبایل
            </button>
          </div>
        </div>

        <!-- Address Bar -->
        <div class="browser-address-bar">
          <span class="address-text" dir="ltr">{project.url}</span>
          <span class="status-indicator">آنلاین</span>
        </div>

        <!-- Actions -->
        <div class="browser-controls-right">
          <a href={project.url} target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
            مشاهده در تب جدید ↗
          </a>
          <button class="close-btn" on:click={onClose} aria-label="بستن">✕</button>
        </div>
      </div>

      <!-- Preview Info Strip -->
      <div class="preview-info-strip">
        <div class="strip-left">
          <strong>{project.title}</strong>
          <span class="strip-tag">{project.categoryLabel}</span>
        </div>
        <div class="strip-right">
          <span>فناوری‌ها:</span>
          {#each project.techStack as tech}
            <span class="strip-tech">{tech}</span>
          {/each}
        </div>
      </div>

      <!-- Preview Viewport Frame -->
      <div class="modal-viewport-area">
        <div class="viewport-device-frame" class:frame-mobile={deviceMode === 'mobile'}>
          {#if iframeError}
            <div class="preview-error-state">
              <div class="error-icon">🔒</div>
              <p>امکان نمایش مستقیم در فریم به دلیل محدودیت‌های امنیتی وب‌سایت مقصد (X-Frame-Options) وجود ندارد.</p>
              <a href={project.url} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                مشاهده مستقیم وب‌سایت در پنجره جدید ↗
              </a>
            </div>
          {:else if iframeLoading}
            <div class="preview-loading-spinner">
              <div class="spinner"></div>
              <p>در حال بارگذاری پیش‌نمایش زنده وب‌سایت...</p>
              <span class="loading-hint">اگر سایت باز نشد، از دکمه «مشاهده در تب جدید» استفاده کنید.</span>
            </div>
          {/if}

          <!-- Live iframe -->
          <iframe 
            src={project.url} 
            title={`پیش‌نمایش وب‌سایت ${project.title}`}
            class="preview-iframe"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            on:load={handleIframeLoad}
            on:error={handleIframeError}
          ></iframe>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-wrapper {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: none;
    cursor: pointer;
  }

  .modal-container {
    position: relative;
    z-index: 201;
    width: 100%;
    max-width: 1180px;
    height: 90vh;
    background: #ffffff;
    border-radius: var(--radius-xl);
    box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-subtle);
  }

  /* Browser Header */
  .modal-browser-header {
    background: #f8fafc;
    border-bottom: 1px solid var(--border-subtle);
    padding: 12px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .browser-controls-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .browser-dots {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
  }

  .dot-red { background: #ef4444; }
  .dot-yellow { background: #f59e0b; }
  .dot-green { background: #10b981; }

  .device-switcher {
    display: flex;
    background: #e2e8f0;
    padding: 3px;
    border-radius: var(--radius-md);
    gap: 2px;
  }

  .device-btn {
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    transition: all 0.15s ease;
  }

  .device-btn.active {
    background: #ffffff;
    color: var(--primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .browser-address-bar {
    flex: 1;
    min-width: 200px;
    max-width: 480px;
    background: #ffffff;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-full);
    padding: 6px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-main);
  }

  .address-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--font-en);
    font-weight: 500;
  }

  .status-indicator {
    color: var(--success);
    font-weight: 700;
    font-size: 11px;
  }

  .browser-controls-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    background: #e2e8f0;
    color: var(--text-main);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
  }

  .close-btn:hover {
    background: #cbd5e1;
  }

  /* Info Strip */
  .preview-info-strip {
    background: var(--bg-surface);
    padding: 8px 18px;
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12.5px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .strip-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .strip-tag {
    background: var(--primary-light);
    color: var(--primary);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-weight: 600;
  }

  .strip-right {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-muted);
  }

  .strip-tech {
    background: #ffffff;
    border: 1px solid var(--border-subtle);
    padding: 1px 6px;
    border-radius: 4px;
    font-family: var(--font-en);
    font-size: 11px;
  }

  /* Viewport Area */
  .modal-viewport-area {
    flex: 1;
    background: #f1f5f9;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .viewport-device-frame {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    position: relative;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .viewport-device-frame.frame-mobile {
    width: 390px;
    height: 800px;
    max-height: 100%;
    border-radius: 36px;
    border: 8px solid #0f172a;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  .preview-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  /* Loading state */
  .preview-loading-spinner {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
    gap: 12px;
    z-index: 10;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-subtle);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .preview-loading-spinner p {
    font-weight: 700;
    font-size: 14px;
    color: var(--text-main);
  }

  .loading-hint {
    font-size: 12px;
    color: var(--text-subtle);
    max-width: 400px;
  }
</style>
