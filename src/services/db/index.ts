import type { IDatabaseAdapter } from './adapter.interface';
import { LocalStorageAdapter } from './local.adapter';
import { SupabaseAdapter } from './supabase.adapter';

const SUPABASE_CONFIG_KEYS = {
  URL: 'km_studio_supabase_url',
  ANON_KEY: 'km_studio_supabase_anon_key'
};

let activeAdapter: IDatabaseAdapter | null = null;

export function getDatabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  if (typeof window === 'undefined') {
    return { url: '', anonKey: '', isConfigured: false };
  }

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = localStorage.getItem(SUPABASE_CONFIG_KEYS.URL) || '';
  const storedKey = localStorage.getItem(SUPABASE_CONFIG_KEYS.ANON_KEY) || '';

  let url = (envUrl || storedUrl).trim();
  if (url) {
    url = url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  }
  const anonKey = (envKey || storedKey).trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey)
  };
}

export function setDatabaseCredentials(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  if (url && anonKey) {
    localStorage.setItem(SUPABASE_CONFIG_KEYS.URL, url.trim());
    localStorage.setItem(SUPABASE_CONFIG_KEYS.ANON_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(SUPABASE_CONFIG_KEYS.URL);
    localStorage.removeItem(SUPABASE_CONFIG_KEYS.ANON_KEY);
  }
  // Reset active adapter instance so next call uses updated credentials
  activeAdapter = null;
}

export function getDatabase(): IDatabaseAdapter {
  if (activeAdapter) return activeAdapter;

  const { url, anonKey, isConfigured } = getDatabaseCredentials();

  if (isConfigured) {
    try {
      activeAdapter = new SupabaseAdapter(url, anonKey);
      return activeAdapter;
    } catch (e) {
      console.warn('Failed to initialize SupabaseAdapter, falling back to LocalStorage', e);
    }
  }

  activeAdapter = new LocalStorageAdapter();
  return activeAdapter;
}

export function getEnvStudioProfile(): import('./types').StudioProfile {
  const env = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  return {
    brandName: env.VITE_STUDIO_BRAND_NAME || 'KM Studio — استودیو مریدی',
    managerName: env.VITE_STUDIO_MANAGER_NAME || 'کاظم مریدی',
    nationalId: env.VITE_STUDIO_NATIONAL_ID || '',
    economicCode: env.VITE_STUDIO_ECONOMIC_CODE || '',
    registrationNumber: env.VITE_STUDIO_REGISTRATION_NUMBER || '',
    phone: env.VITE_STUDIO_PHONE || '+989170284463',
    phoneDisplay: env.VITE_STUDIO_PHONE_DISPLAY || '۰۹۱۷ ۰۲۸ ۴۴۶۳',
    email: env.VITE_STUDIO_EMAIL || 'kazem.codes@gmail.com',
    website: env.VITE_STUDIO_WEBSITE || 'https://kazemmoridi.ir',
    shebaNumber: env.VITE_STUDIO_SHEBA_NUMBER || '',
    cardNumber: env.VITE_STUDIO_CARD_NUMBER || '',
    bankName: env.VITE_STUDIO_BANK_NAME || 'بانک ملی ایران',
    address: env.VITE_STUDIO_ADDRESS || 'هرمزگان، ایران — ارائه خدمات توسعه و طراحی نرم‌افزار در سراسر کشور',
    postalCode: env.VITE_STUDIO_POSTAL_CODE || ''
  };
}

export * from './types';
export * from './adapter.interface';
