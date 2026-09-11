import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getDatabaseCredentials } from '../db';

const SESSION_KEY = 'km_studio_admin_session';
const LOCAL_MASTER_PASS_KEY = 'km_studio_local_master_pwd';
const DEFAULT_LOCAL_PASS = 'online2012';
const DEFAULT_ADMIN_EMAIL = 'kazem.codes@gmail.com';

interface AuthResult {
  success: boolean;
  error?: string;
  userEmail?: string;
}

interface AttemptTracker {
  count: number;
  lastAttempt: number;
  lockedUntil: number;
}

const ATTEMPT_STORAGE_KEY = 'km_studio_login_attempts';

function getAttemptTracker(): AttemptTracker {
  try {
    const raw = sessionStorage.getItem(ATTEMPT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastAttempt: 0, lockedUntil: 0 };
}

function saveAttemptTracker(tracker: AttemptTracker): void {
  try {
    sessionStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(tracker));
  } catch {}
}

export class AuthService {
  private static getSupabaseClient(): SupabaseClient | null {
    const { url, anonKey, isConfigured } = getDatabaseCredentials();
    if (!isConfigured) return null;
    try {
      return createClient(url, anonKey);
    } catch {
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Check sessionStorage flag
    const hasLocalSession = sessionStorage.getItem(SESSION_KEY) === 'true';
    if (!hasLocalSession) return false;

    const supabase = this.getSupabaseClient();
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      return Boolean(data?.session);
    }

    // Local mode authenticated
    return hasLocalSession;
  }

  static async login(password: string, email?: string): Promise<AuthResult> {
    const now = Date.now();
    const tracker = getAttemptTracker();

    // Check brute-force lockout
    if (tracker.lockedUntil > now) {
      const remainingSeconds = Math.ceil((tracker.lockedUntil - now) / 1000);
      return {
        success: false,
        error: `تعداد تلاش‌های ناموفق بیش از حد مجاز بود. به دلایل امنیتی ورود موقتاً مسدود شده است. لطفاً ${remainingSeconds} ثانیه دیگر مجدداً تلاش فرمایید.`
      };
    }

    const supabase = this.getSupabaseClient();

    const envEmail = ((import.meta as any).env?.VITE_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
    const envPass = ((import.meta as any).env?.VITE_ADMIN_PASSWORD || DEFAULT_LOCAL_PASS).trim();
    const storedMaster = localStorage.getItem(LOCAL_MASTER_PASS_KEY) || envPass;

    const inputEmail = (email || '').trim().toLowerCase();
    const inputPass = password.trim();

    // Both email and password are required
    if (!inputEmail || !inputPass) {
      return {
        success: false,
        error: 'وارد کردن نام کاربری / ایمیل و گذرواژه الزامی است.'
      };
    }

    // 1. Check direct .env / Master credentials first
    const isDirectMatch = (inputPass === envPass || inputPass === storedMaster) &&
      (inputEmail === envEmail);

    if (isDirectMatch) {
      this.resetAttempts();
      sessionStorage.setItem(SESSION_KEY, 'true');
      return {
        success: true,
        userEmail: envEmail
      };
    }

    // 2. Try Supabase Auth if configured
    if (supabase && email) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: inputEmail,
          password: inputPass
        });

        if (!error && data.session) {
          this.resetAttempts();
          sessionStorage.setItem(SESSION_KEY, 'true');
          return {
            success: true,
            userEmail: data.user?.email || envEmail
          };
        }
      } catch (e: any) {
        console.warn('Supabase auth attempt', e);
      }
    }

    this.recordFailedAttempt();
    return {
      success: false,
      error: 'نام کاربری / ایمیل یا گذرواژه مدیریت نادرست است.'
    };
  }

  static async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY);
    }
    const supabase = this.getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Logout error', e);
      }
    }
  }

  static setLocalMasterPassword(newPass: string): void {
    if (typeof window === 'undefined') return;
    if (newPass.trim()) {
      localStorage.setItem(LOCAL_MASTER_PASS_KEY, newPass.trim());
    }
  }

  private static recordFailedAttempt(): void {
    const now = Date.now();
    const tracker = getAttemptTracker();
    tracker.count++;
    tracker.lastAttempt = now;

    if (tracker.count >= 5) {
      tracker.lockedUntil = now + 60000; // 60 seconds lockout
      tracker.count = 0;
    }
    saveAttemptTracker(tracker);
  }

  private static resetAttempts(): void {
    saveAttemptTracker({
      count: 0,
      lastAttempt: 0,
      lockedUntil: 0
    });
  }
}
