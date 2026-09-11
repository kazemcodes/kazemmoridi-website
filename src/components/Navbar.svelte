<script lang="ts">
  import { onMount } from 'svelte';
  import { contactData } from '../data/contacts';

  let isScrolled = false;
  let mobileMenuOpen = false;

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 30;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function toggleMobile() {
    mobileMenuOpen = !mobileMenuOpen;
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  }

  function closeMobile() {
    mobileMenuOpen = false;
    document.body.style.overflow = '';
  }
</script>

<header class="navbar-wrapper" class:scrolled={isScrolled}>
  <div class="container">
    <nav class="navbar">
      <!-- Logo -->
      <a href="#hero" class="brand-logo" on:click={closeMobile}>
        <div class="logo-icon">KM</div>
        <div class="logo-text">
          <span class="logo-main">KM Studio</span>
          <span class="logo-sub">استودیو طراحی وب</span>
        </div>
      </a>

      <!-- Desktop Nav Links -->
      <div class="nav-menu">
        <a href="#services" class="nav-item">خدمات</a>
        <a href="#projects" class="nav-item">نمونه‌کارها</a>
        <a href="#pipeline" class="nav-item">محصولات</a>
        <a href="#calculator" class="nav-item">محاسبه هزینه</a>
        <a href="#why-us" class="nav-item">درباره ما</a>
        <a href="#contact" class="nav-item">تماس</a>
      </div>

      <!-- Action Button & Phone -->
      <div class="nav-actions">
        <a href={`tel:${contactData.phone}`} class="nav-phone" title="تماس تلفنی">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="phone-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <bdi class="phone-number" dir="ltr">{contactData.phoneDisplay}</bdi>
        </a>
        <a href={contactData.bale} target="_blank" rel="noopener noreferrer" class="nav-bale-btn" title="پیام در بله">
          بله
        </a>
        <a href="#contact" class="nav-cta">
          درخواست مشاوره
        </a>
        <!-- Mobile Toggle Button -->
        <button class="mobile-toggle" on:click={toggleMobile} aria-label="منو">
          <span class="bar bar-top" class:open={mobileMenuOpen}></span>
          <span class="bar bar-mid" class:open={mobileMenuOpen}></span>
          <span class="bar bar-bot" class:open={mobileMenuOpen}></span>
        </button>
      </div>
    </nav>
  </div>
</header>

<!-- Mobile Navigation Drawer -->
{#if mobileMenuOpen}
  <div class="mobile-drawer-backdrop" on:click={closeMobile} aria-hidden="true"></div>
  <div class="mobile-drawer" role="dialog" aria-modal="true">
    <div class="drawer-content">
      <div class="drawer-links">
        <a href="#services" on:click={closeMobile}>خدمات</a>
        <a href="#projects" on:click={closeMobile}>نمونه‌کارها</a>
        <a href="#pipeline" on:click={closeMobile}>در حال ساخت</a>
        <a href="#calculator" on:click={closeMobile}>محاسبه هزینه</a>
        <a href="#ireader" on:click={closeMobile}>محصولات جهانی</a>
        <a href="#why-us" on:click={closeMobile}>درباره ما</a>
        <a href="#process" on:click={closeMobile}>فرآیند همکاری</a>
        <a href="#contact" on:click={closeMobile}>تماس و ثبت سفارش</a>
        <a href={contactData.bale} target="_blank" rel="noopener noreferrer" on:click={closeMobile} class="drawer-bale-link">
          پیام‌رسان بله ({contactData.baleUsername}) ↗
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  .navbar-wrapper {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .navbar-wrapper.scrolled {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
  }

  @media (min-width: 1024px) {
    .navbar {
      height: 64px;
    }
  }

  /* Logo */
  .brand-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background-color: #1e40af;
    color: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .logo-main {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;
    letter-spacing: -0.2px;
  }

  .logo-sub {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
  }

  /* Nav Links */
  .nav-menu {
    display: none;
    align-items: center;
    gap: 22px;
  }

  @media (min-width: 1024px) {
    .nav-menu {
      display: flex;
    }
  }

  .nav-item {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    text-decoration: none;
    position: relative;
    padding: 8px 0;
    transition: color 0.2s ease;
  }

  .nav-item:hover {
    color: #1e40af;
  }

  .nav-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 2px;
    background-color: #1e40af;
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .nav-item:hover::after {
    width: 100%;
    left: 0;
    right: auto;
  }

  /* Actions */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .nav-phone {
    display: none;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  .phone-icon {
    color: #64748b;
    transition: color 0.2s ease;
  }

  .nav-phone:hover {
    color: #1e40af;
  }
  
  .nav-phone:hover .phone-icon {
    color: #1e40af;
  }

  @media (min-width: 768px) {
    .nav-phone {
      display: flex;
    }
  }

  .nav-bale-btn {
    display: none;
    align-items: center;
    justify-content: center;
    background-color: #f0fdf4;
    color: #059669;
    border: 1px solid #bbf7d0;
    font-size: 13px;
    font-weight: 700;
    padding: 0 14px;
    height: 38px;
    border-radius: 9999px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .nav-bale-btn:hover {
    background-color: #dcfce7;
    border-color: #86efac;
    color: #047857;
  }

  @media (min-width: 768px) {
    .nav-bale-btn {
      display: inline-flex;
    }
  }

  .nav-cta {
    display: none;
    align-items: center;
    justify-content: center;
    background-color: #1e40af;
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    padding: 0 20px;
    height: 38px;
    border-radius: 9999px;
    text-decoration: none;
    transition: background-color 0.2s ease;
  }
  
  .nav-cta:hover {
    background-color: #1e3a8a;
  }

  @media (min-width: 640px) {
    .nav-cta {
      display: inline-flex;
    }
  }

  .drawer-bale-link {
    background-color: #ecfdf5 !important;
    color: #059669 !important;
    padding: 10px 20px;
    border-radius: 12px;
    border: 1px solid #a7f3d0;
    font-size: 16px !important;
  }

  /* Mobile Toggle */
  .mobile-toggle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 200;
    padding: 0;
  }

  @media (min-width: 1024px) {
    .mobile-toggle {
      display: none;
    }
  }

  .bar {
    width: 22px;
    height: 2px;
    background-color: #1e293b;
    border-radius: 2px;
    transition: all 0.3s ease;
    position: absolute;
  }

  .bar-top {
    transform: translateY(-6px);
  }

  .bar-mid {
    transform: translateY(0);
  }

  .bar-bot {
    transform: translateY(6px);
  }

  .bar-top.open {
    transform: translateY(0) rotate(45deg);
  }

  .bar-mid.open {
    opacity: 0;
  }

  .bar-bot.open {
    transform: translateY(0) rotate(-45deg);
  }

  /* Mobile Drawer */
  .mobile-drawer-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 150;
  }

  .mobile-drawer {
    position: fixed;
    inset: 0;
    z-index: 151;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none; /* Let clicks pass to backdrop except for content */
  }

  .drawer-content {
    width: 100%;
    max-width: 400px;
    padding: 24px;
    pointer-events: auto;
  }

  .drawer-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .drawer-links a {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .drawer-links a:hover {
    color: #1e40af;
  }
</style>
