import type { IDatabaseAdapter } from './adapter.interface';
import type { Client, Invoice, OfficialLetter, StudioProfile } from './types';

const STORAGE_KEYS = {
  INVOICES: 'km_studio_invoices',
  LETTERS: 'km_studio_letters',
  CLIENTS: 'km_studio_clients',
  PROFILE: 'km_studio_profile'
};

const INITIAL_CLIENTS: Client[] = [];
const INITIAL_INVOICES: Invoice[] = [];
const INITIAL_LETTERS: OfficialLetter[] = [];

const INITIAL_PROFILE: StudioProfile = {
  brandName: 'KM Studio — استودیو مریدی',
  managerName: 'کاظم مریدی',
  nationalId: '',
  economicCode: '',
  registrationNumber: '',
  phone: '+989170284463',
  phoneDisplay: '۰۹۱۷ ۰۲۸ ۴۴۶۳',
  email: 'kazem.codes@gmail.com',
  website: 'https://kazemmoridi.ir',
  shebaNumber: '',
  cardNumber: '',
  bankName: '',
  address: 'هرمزگان، ایران',
  postalCode: ''
};

export class LocalStorageAdapter implements IDatabaseAdapter {
  readonly providerName = 'LocalStorage (حالت محلی)';

  private getStored<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setStored<T>(key: string, val: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }

  // --- Invoices ---
  async getInvoices(): Promise<Invoice[]> {
    return this.getStored<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const list = await this.getInvoices();
    return list.find(i => i.id === id) || null;
  }

  async saveInvoice(invoice: Invoice): Promise<Invoice> {
    const list = await this.getInvoices();
    const idx = list.findIndex(i => i.id === invoice.id);
    if (idx >= 0) {
      list[idx] = { ...invoice, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...invoice, createdAt: new Date().toISOString() });
    }
    this.setStored(STORAGE_KEYS.INVOICES, list);
    return invoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    const list = await this.getInvoices();
    this.setStored(STORAGE_KEYS.INVOICES, list.filter(i => i.id !== id));
  }

  // --- Letters ---
  async getLetters(): Promise<OfficialLetter[]> {
    return this.getStored<OfficialLetter[]>(STORAGE_KEYS.LETTERS, INITIAL_LETTERS);
  }

  async getLetterById(id: string): Promise<OfficialLetter | null> {
    const list = await this.getLetters();
    return list.find(l => l.id === id) || null;
  }

  async saveLetter(letter: OfficialLetter): Promise<OfficialLetter> {
    const list = await this.getLetters();
    const idx = list.findIndex(l => l.id === letter.id);
    if (idx >= 0) {
      list[idx] = { ...letter, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...letter, createdAt: new Date().toISOString() });
    }
    this.setStored(STORAGE_KEYS.LETTERS, list);
    return letter;
  }

  async deleteLetter(id: string): Promise<void> {
    const list = await this.getLetters();
    this.setStored(STORAGE_KEYS.LETTERS, list.filter(l => l.id !== id));
  }

  // --- Clients ---
  async getClients(): Promise<Client[]> {
    return this.getStored<Client[]>(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
  }

  async getClientById(id: string): Promise<Client | null> {
    const list = await this.getClients();
    return list.find(c => c.id === id) || null;
  }

  async saveClient(client: Client): Promise<Client> {
    const list = await this.getClients();
    const idx = list.findIndex(c => c.id === client.id);
    if (idx >= 0) {
      list[idx] = { ...client, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...client, createdAt: new Date().toISOString() });
    }
    this.setStored(STORAGE_KEYS.CLIENTS, list);
    return client;
  }

  async deleteClient(id: string): Promise<void> {
    const list = await this.getClients();
    this.setStored(STORAGE_KEYS.CLIENTS, list.filter(c => c.id !== id));
  }

  // --- Studio Profile ---
  async getStudioProfile(): Promise<StudioProfile> {
    return this.getStored<StudioProfile>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE);
  }

  async saveStudioProfile(profile: StudioProfile): Promise<StudioProfile> {
    this.setStored(STORAGE_KEYS.PROFILE, profile);
    return profile;
  }
}
