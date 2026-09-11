<script lang="ts">
  import { AuthService } from '../../services/auth/auth.service';
  import { AlertCircle, LogIn, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-svelte';

  export let onLoginSuccess: () => void;
  export let onExit: () => void;

  let email = '';
  let password = '';
  let showPassword = false;
  let errorMsg = '';
  let submitting = false;

  async function handleSubmit() {
    errorMsg = '';
    if (!email.trim()) {
      errorMsg = 'لطفاً نام کاربری یا پست الکترونیک را وارد نمایید.';
      return;
    }
    if (!password.trim()) {
      errorMsg = 'لطفاً گذرواژه ورود را وارد نمایید.';
      return;
    }

    submitting = true;
    try {
      const res = await AuthService.login(password, email);
      if (res.success) {
        onLoginSuccess();
      } else {
        errorMsg = res.error || 'ورود ناموفق بود.';
      }
    } catch (e: any) {
      errorMsg = e.message || 'خطای غیرمنتظره در احراز هویت';
    } finally {
      submitting = false;
    }
  }
</script>

<div class="login-wrapper">
  <div class="login-card animate-fade-in">
    <!-- Header -->
    <div class="login-header">
      <div class="brand-badge">
        <ShieldCheck size={28} />
      </div>
      <h2>درگاه امن مدیریت استودیو مریدی</h2>
      <p>دسترسی به بخش امور مالی، صدور فاکتور و مکاتبات اداری نیازمند احراز هویت است.</p>
    </div>

    <!-- Error Alert -->
    {#if errorMsg}
      <div class="alert-error">
        <AlertCircle size={18} />
        <span>{errorMsg}</span>
      </div>
    {/if}

    <!-- Form -->
    <form class="login-form" on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="admin-email">نام کاربری یا پست الکترونیک</label>
        <input
          id="admin-email"
          type="text"
          dir="ltr"
          placeholder="username / email"
          bind:value={email}
          autocomplete="username"
          required
        />
      </div>

      <div class="form-group">
        <div class="label-row">
          <label for="admin-password">گذرواژه ورود به پنل مدیریت</label>
          <button
            type="button"
            class="toggle-pass-btn"
            on:click={() => showPassword = !showPassword}
          >
            {#if showPassword}
              <EyeOff size={14} />
              <span>مخفی‌سازی</span>
            {:else}
              <Eye size={14} />
              <span>نمایش</span>
            {/if}
          </button>
        </div>
        <div class="password-input-wrapper">
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            dir="ltr"
            placeholder="••••••••••••"
            bind:value={password}
            autocomplete="current-password"
            required
          />
        </div>
      </div>

      <button type="submit" class="btn-submit" disabled={submitting}>
        {#if submitting}
          <span>در حال بررسی و ورود امن...</span>
        {:else}
          <LogIn size={18} />
          <span>ورود به پنل مدیریت</span>
        {/if}
      </button>

      <div class="login-footer">
        <button type="button" class="btn-exit" on:click={onExit}>
          <ArrowRight size={16} />
          <span>بازگشت به وب‌سایت اصلی</span>
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%);
    padding: 24px;
    direction: rtl;
    font-family: var(--font-fa);
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 20px;
    padding: 40px 32px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .login-header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .brand-badge {
    width: 52px;
    height: 52px;
    background: #1e40af;
    color: #ffffff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 900;
    margin-bottom: 4px;
  }

  .login-header h2 {
    font-size: 18px;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
  }

  .login-header p {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
  }

  .alert-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.5;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 12px;
    font-weight: 700;
    color: #334155;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .toggle-pass-btn {
    background: transparent;
    border: none;
    color: #1e40af;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .form-group input {
    width: 100%;
    padding: 11px 14px;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    font-size: 14px;
    font-family: inherit;
    background: #ffffff;
    box-sizing: border-box;
    outline: none;
    transition: all 0.15s ease;
  }

  .form-group input:focus {
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }

  .btn-submit {
    width: 100%;
    padding: 13px;
    background: #1e40af;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 800;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s ease;
    margin-top: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-submit:hover:not(:disabled) {
    background: #1e3a8a;
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .login-footer {
    display: flex;
    justify-content: center;
    padding-top: 8px;
  }

  .btn-exit {
    background: transparent;
    border: none;
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: color 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .btn-exit:hover {
    color: #1e40af;
  }
</style>
