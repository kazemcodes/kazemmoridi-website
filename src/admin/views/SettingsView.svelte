<script lang="ts">
  import { onMount } from 'svelte';
  import {
    getDatabase,
    getDatabaseCredentials,
    setDatabaseCredentials,
    getEnvStudioProfile,
    type StudioProfile
  } from '../../services/db';

  let supabaseUrl = '';
  let supabaseAnonKey = '';
  let isConfigured = false;
  let activeProvider = 'Local (Offline)';

  let profile: StudioProfile = getEnvStudioProfile();

  let savingDb = false;
  let savingProfile = false;

  onMount(async () => {
    const creds = getDatabaseCredentials();
    supabaseUrl = creds.url;
    supabaseAnonKey = creds.anonKey;
    isConfigured = creds.isConfigured;

    const envDefaults = getEnvStudioProfile();
    profile = { ...envDefaults, ...profile };

    const db = getDatabase();
    activeProvider = db.providerName;
    try {
      const stored = await db.getStudioProfile();
      if (stored) {
        // Merge stored with env so empty values fall back to .env
        profile = {
          brandName: stored.brandName || envDefaults.brandName,
          managerName: stored.managerName || envDefaults.managerName,
          nationalId: stored.nationalId || envDefaults.nationalId,
          economicCode: stored.economicCode || envDefaults.economicCode,
          registrationNumber: stored.registrationNumber || envDefaults.registrationNumber,
          phone: stored.phone || envDefaults.phone,
          phoneDisplay: stored.phoneDisplay || envDefaults.phoneDisplay,
          email: stored.email || envDefaults.email,
          website: stored.website || envDefaults.website,
          shebaNumber: stored.shebaNumber || envDefaults.shebaNumber,
          cardNumber: stored.cardNumber || envDefaults.cardNumber,
          bankName: stored.bankName || envDefaults.bankName,
          address: stored.address || envDefaults.address,
          postalCode: stored.postalCode || envDefaults.postalCode,
          logoUrl: stored.logoUrl || envDefaults.logoUrl,
          stampSignatureUrl: stored.stampSignatureUrl || envDefaults.stampSignatureUrl
        };
      }
    } catch (e) {
      console.error('Failed to load studio profile', e);
    }
  });

  function handleSaveSupabase() {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      alert('لطفاً آدرس Project URL و کلید Anon Key سوپابیس را وارد نمایید.');
      return;
    }
    savingDb = true;
    try {
      setDatabaseCredentials(supabaseUrl, supabaseAnonKey);
      const db = getDatabase();
      activeProvider = db.providerName;
      isConfigured = true;
      alert('تنظیمات Supabase با موفقیت ذخیره شد. دیتابیس فعال گردید!');
    } catch (e) {
      alert('خطا در ذخیره مشخصات Supabase');
    } finally {
      savingDb = false;
    }
  }

  function handleResetToLocal() {
    if (confirm('آیا مایلید اتصال به Supabase لغو شده و از دیتابیس محلی (LocalStorage) استفاده شود؟')) {
      setDatabaseCredentials('', '');
      supabaseUrl = '';
      supabaseAnonKey = '';
      isConfigured = false;
      const db = getDatabase();
      activeProvider = db.providerName;
      alert('دیتابیس به حالت محلی (LocalStorage) تغییر یافت.');
    }
  }

  async function handleSaveProfile() {
    savingProfile = true;
    try {
      const db = getDatabase();
      await db.saveStudioProfile(profile);
      alert('مشخصات رسمی استودیو با موفقیت ذخیره شد.');
    } catch (e) {
      alert('خطا در ذخیره مشخصات استودیو');
    } finally {
      savingProfile = false;
    }
  }
</script>

<div class="settings-view">
  <div class="view-header">
    <div class="header-titles">
      <h2>تنظیمات دیتابیس، استودیو و حساب بانکی</h2>
      <p>پیکربندی اتصال به Supabase، مشخصات حقوقی مهر و سربرگ استودیو جهت درج در فاکتورها</p>
    </div>
  </div>

  <div class="settings-grid">
    <!-- 1. Database Connection -->
    <div class="settings-card">
      <div class="card-header">
        <div class="header-with-badge">
          <h3>۱. اتصال به پایگاه‌داده (Database Connection)</h3>
          <span class="db-status-badge" class:active={isConfigured}>
            ارائه‌دهنده فعال: {activeProvider}
          </span>
        </div>
      </div>

      <div class="info-alert">
        <strong>پیکربندی آسان دیتابیس Supabase:</strong>
        <p>
          شما می‌توانید اطلاعات پروژه Supabase را مستقیماً در فایل <code>.env</code> پروژه (متغیرهای <code>VITE_SUPABASE_URL</code> و <code>VITE_SUPABASE_ANON_KEY</code>) قرار دهید تا به طور خودکار لود شود، یا از طریق فرم زیر آن‌ها را ذخیره نمایید.
        </p>
      </div>

      <div class="inputs-row">
        <div class="input-field flex-2">
          <label>Supabase Project URL (آدرس پروژه)</label>
          <input
            type="text"
            dir="ltr"
            placeholder="https://xyzcompany.supabase.co"
            bind:value={supabaseUrl}
          />
        </div>
      </div>

      <div class="inputs-row">
        <div class="input-field flex-2">
          <label>Supabase Anon / Public Key (کلید عمومی)</label>
          <input
            type="password"
            dir="ltr"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            bind:value={supabaseAnonKey}
          />
        </div>
      </div>

      <div class="db-actions">
        <button class="btn btn-primary" disabled={savingDb} on:click={handleSaveSupabase}>
          {savingDb ? 'در حال اتصال...' : 'ذخیره و فعال‌سازی Supabase'}
        </button>
        {#if isConfigured}
          <button class="btn btn-outline" on:click={handleResetToLocal}>
            قطع اتصال و سوییچ به LocalStorage
          </button>
        {/if}
      </div>

      <div class="schema-hint">
        <span>راهنمای ساخت جداول در سوپابیس:</span>
        <p>
          اسکریپت SQL آماده برای ساخت جداول، ایندکس‌ها و امنیت در مسیر پروژه با نام <code>supabase/schema.sql</code> قرار دارد. کافیست محتوای آن را در بخش <strong>SQL Editor</strong> داشبورد Supabase خود کپی و دکمه Run را بزنید.
        </p>
      </div>
    </div>

    <!-- 2. Studio Profile & Official Billing -->
    <div class="settings-card">
      <div class="card-header">
        <h3>۲. مشخصات رسمی فروشنده، مهر و حساب‌های بانکی</h3>
      </div>

      <div class="inputs-row">
        <div class="input-field flex-1">
          <label>نام تجاری برند</label>
          <input type="text" bind:value={profile.brandName} />
        </div>
        <div class="input-field flex-1">
          <label>نام مدیر استودیو / صاحب امضا</label>
          <input type="text" bind:value={profile.managerName} />
        </div>
      </div>

      <div class="inputs-row">
        <div class="input-field flex-1">
          <label>کد ملی مدیر / شناسه ملی</label>
          <input type="text" bind:value={profile.nationalId} />
        </div>
        <div class="input-field flex-1">
          <label>کد اقتصادی</label>
          <input type="text" bind:value={profile.economicCode} />
        </div>
        <div class="input-field flex-1">
          <label>شماره ثبت / مجوز</label>
          <input type="text" bind:value={profile.registrationNumber} />
        </div>
      </div>

      <div class="inputs-row">
        <div class="input-field flex-1">
          <label>شماره تماس (نمایش در فاکتور)</label>
          <input type="text" dir="ltr" bind:value={profile.phoneDisplay} />
        </div>
        <div class="input-field flex-1">
          <label>ایمیل رسمی</label>
          <input type="email" dir="ltr" bind:value={profile.email} />
        </div>
        <div class="input-field flex-1">
          <label>آدرس وب‌سایت</label>
          <input type="text" dir="ltr" bind:value={profile.website} />
        </div>
      </div>

      <div class="inputs-row">
        <div class="input-field flex-2">
          <label>نشانی دفتر فنی و پستی</label>
          <input type="text" bind:value={profile.address} />
        </div>
        <div class="input-field flex-1">
          <label>کد پستی</label>
          <input type="text" bind:value={profile.postalCode} />
        </div>
      </div>

      <div class="bank-section-title">اطلاعات حساب بانکی جهت دریافت وجوه فاکتور:</div>

      <div class="inputs-row">
        <div class="input-field flex-1">
          <label>نام بانک و شعبه</label>
          <input type="text" bind:value={profile.bankName} />
        </div>
        <div class="input-field flex-1">
          <label>شماره کارت (۱۶ رقمی)</label>
          <input type="text" dir="ltr" bind:value={profile.cardNumber} />
        </div>
        <div class="input-field flex-1">
          <label>شماره شبا (با IR)</label>
          <input type="text" dir="ltr" bind:value={profile.shebaNumber} />
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-primary" disabled={savingProfile} on:click={handleSaveProfile}>
          {savingProfile ? 'در حال ذخیره...' : 'ذخیره مشخصات رسمی استودیو'}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .settings-view {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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

  .settings-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .settings-card {
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
    margin: 0;
  }

  .header-with-badge {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .db-status-badge {
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 11.5px;
    font-weight: 700;
    background: #eff6ff;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }

  .db-status-badge.active {
    background: #ecfdf5;
    color: #059669;
    border-color: #a7f3d0;
  }

  .info-alert {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 18px;
    font-size: 12.5px;
    color: #334155;
    line-height: 1.7;
  }

  .info-alert strong {
    color: #1e40af;
    display: block;
    margin-bottom: 4px;
  }

  .info-alert p {
    margin: 0;
  }

  .inputs-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .inputs-row:last-child {
    margin-bottom: 0;
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

  .db-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .btn {
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  .btn-primary { background: #1e40af; color: #ffffff; }
  .btn-primary:hover { background: #1e3a8a; }

  .btn-outline { background: #ffffff; color: #475569; border: 1px solid #cbd5e1; }
  .btn-outline:hover { background: #f8fafc; }

  .schema-hint {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px dashed #e2e8f0;
    font-size: 12px;
    color: #64748b;
  }

  .schema-hint span {
    font-weight: 700;
    color: #1e293b;
    display: block;
    margin-bottom: 4px;
  }

  .schema-hint code {
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    color: #1e40af;
    direction: ltr;
    display: inline-block;
  }

  .bank-section-title {
    font-size: 13px;
    font-weight: 800;
    color: #1e40af;
    margin: 18px 0 12px 0;
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #f1f5f9;
  }
</style>
