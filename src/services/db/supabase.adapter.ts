import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { IDatabaseAdapter } from './adapter.interface';
import type { Client, Invoice, InvoiceItem, OfficialLetter, StudioProfile } from './types';
import { generateUUID, isValidUUID } from '../../utils/uuid';

export class SupabaseAdapter implements IDatabaseAdapter {
  readonly providerName = 'Supabase Cloud';
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  // --- Local Backup Helpers for High Network Resilience ---
  private saveLocalBackup(table: string, item: any): void {
    if (typeof window === 'undefined') return;
    try {
      const key = `km_studio_${table}`;
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((x: any) => x.id === item.id);
      if (idx >= 0) {
        list[idx] = item;
      } else {
        list.unshift(item);
      }
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
  }

  private deleteLocalBackup(table: string, id: string): void {
    if (typeof window === 'undefined') return;
    try {
      const key = `km_studio_${table}`;
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const list = JSON.parse(raw).filter((x: any) => x.id !== id);
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
  }

  private getLocalBackup<T>(table: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(`km_studio_${table}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // --- Invoices ---
  async getInvoices(): Promise<Invoice[]> {
    try {
      const { data: invoicesData, error: invError } = await this.client
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invError) {
        console.warn('[SupabaseAdapter] getInvoices query failed:', invError);
        throw invError;
      }
      if (!invoicesData || invoicesData.length === 0) return [];

      const invoiceIds = invoicesData.map((inv: any) => inv.id);
      const { data: itemsData, error: itemsError } = await this.client
        .from('invoice_items')
        .select('*')
        .in('invoice_id', invoiceIds)
        .order('item_order', { ascending: true });

      if (itemsError) throw itemsError;

      const itemsByInvoice = (itemsData || []).reduce((acc: any, item: any) => {
        if (!acc[item.invoice_id]) acc[item.invoice_id] = [];
        acc[item.invoice_id].push({
          id: item.id,
          invoiceId: item.invoice_id,
          description: item.description,
          quantity: Number(item.quantity),
          unit: item.unit,
          unitPrice: Number(item.unit_price),
          discount: Number(item.discount || 0),
          totalPrice: Number(item.total_price),
          itemOrder: item.item_order
        });
        return acc;
      }, {});

      const result: Invoice[] = invoicesData.map((inv: any) => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        type: inv.type,
        title: inv.title,
        clientId: inv.client_id,
        buyerName: inv.buyer_name,
        buyerCompany: inv.buyer_company,
        buyerNationalId: inv.buyer_national_id,
        buyerEconomicCode: inv.buyer_economic_code,
        buyerPhone: inv.buyer_phone,
        buyerPostalCode: inv.buyer_postal_code,
        buyerAddress: inv.buyer_address,
        issueDate: inv.issue_date,
        dueDate: inv.due_date,
        status: inv.status,
        subtotal: Number(inv.subtotal),
        discountAmount: Number(inv.discount_amount),
        taxPercent: Number(inv.tax_percent),
        taxAmount: Number(inv.tax_amount),
        totalAmount: Number(inv.total_amount),
        paymentMethod: inv.payment_method,
        notes: inv.notes,
        terms: inv.terms,
        createdAt: inv.created_at,
        updatedAt: inv.updated_at,
        items: itemsByInvoice[inv.id] || []
      }));

      // Cache locally for offline resilience
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('km_studio_invoices', JSON.stringify(result));
        } catch {}
      }

      return result;
    } catch (e: any) {
      console.warn('[SupabaseAdapter] Failed to fetch invoices from Supabase, attempting local backup:', e);
      const backup = this.getLocalBackup<Invoice>('invoices');
      if (backup.length > 0) return backup;
      throw e;
    }
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    try {
      const { data: inv, error: invError } = await this.client
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (invError || !inv) {
        // Check backup
        const backup = this.getLocalBackup<Invoice>('invoices');
        const found = backup.find(i => i.id === id);
        return found || null;
      }

      const { data: itemsData } = await this.client
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', id)
        .order('item_order', { ascending: true });

      const items: InvoiceItem[] = (itemsData || []).map((item: any) => ({
        id: item.id,
        invoiceId: item.invoice_id,
        description: item.description,
        quantity: Number(item.quantity),
        unit: item.unit,
        unitPrice: Number(item.unit_price),
        discount: Number(item.discount || 0),
        totalPrice: Number(item.total_price),
        itemOrder: item.item_order
      }));

      return {
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        type: inv.type,
        title: inv.title,
        clientId: inv.client_id,
        buyerName: inv.buyer_name,
        buyerCompany: inv.buyer_company,
        buyerNationalId: inv.buyer_national_id,
        buyerEconomicCode: inv.buyer_economic_code,
        buyerPhone: inv.buyer_phone,
        buyerPostalCode: inv.buyer_postal_code,
        buyerAddress: inv.buyer_address,
        issueDate: inv.issue_date,
        dueDate: inv.due_date,
        status: inv.status,
        subtotal: Number(inv.subtotal),
        discountAmount: Number(inv.discount_amount),
        taxPercent: Number(inv.tax_percent),
        taxAmount: Number(inv.tax_amount),
        totalAmount: Number(inv.total_amount),
        paymentMethod: inv.payment_method,
        notes: inv.notes,
        terms: inv.terms,
        createdAt: inv.created_at,
        updatedAt: inv.updated_at,
        items
      };
    } catch (e) {
      console.warn('[SupabaseAdapter] getInvoiceById error, checking local backup:', e);
      const backup = this.getLocalBackup<Invoice>('invoices');
      return backup.find(i => i.id === id) || null;
    }
  }

  async saveInvoice(invoice: Invoice): Promise<Invoice> {
    // 1. Ensure valid RFC-4122 UUID for primary key
    const invoiceId = isValidUUID(invoice.id) ? invoice.id : generateUUID();
    invoice.id = invoiceId;

    // 2. Ensure valid UUID or null for foreign key client_id
    const clientId = (invoice.clientId && isValidUUID(invoice.clientId)) ? invoice.clientId : null;

    const invoicePayload = {
      id: invoiceId,
      invoice_number: invoice.invoiceNumber,
      type: invoice.type,
      title: invoice.title,
      client_id: clientId,
      buyer_name: invoice.buyerName,
      buyer_company: invoice.buyerCompany || null,
      buyer_national_id: invoice.buyerNationalId || null,
      buyer_economic_code: invoice.buyerEconomicCode || null,
      buyer_phone: invoice.buyerPhone || null,
      buyer_postal_code: invoice.buyerPostalCode || null,
      buyer_address: invoice.buyerAddress || null,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate || null,
      status: invoice.status,
      subtotal: Number(invoice.subtotal) || 0,
      discount_amount: Number(invoice.discountAmount) || 0,
      tax_percent: Number(invoice.taxPercent) || 0,
      tax_amount: Number(invoice.taxAmount) || 0,
      total_amount: Number(invoice.totalAmount) || 0,
      payment_method: invoice.paymentMethod || null,
      notes: invoice.notes || null,
      terms: invoice.terms || null,
      updated_at: new Date().toISOString()
    };

    // Always keep a local copy as instant safety backup
    this.saveLocalBackup('invoices', invoice);

    try {
      const { error: upsertError } = await this.client
        .from('invoices')
        .upsert(invoicePayload);

      if (upsertError) {
        console.error('[SupabaseAdapter] Failed to upsert invoice:', upsertError);
        const errMsg = upsertError.message || upsertError.details || 'خطا در ثبت سند مالی در سرور Supabase';
        throw new Error(errMsg);
      }

      // Replace items
      await this.client.from('invoice_items').delete().eq('invoice_id', invoiceId);

      if (invoice.items && invoice.items.length > 0) {
        const itemsPayload = invoice.items.map((item, idx) => ({
          id: isValidUUID(item.id) ? item.id : generateUUID(),
          invoice_id: invoiceId,
          description: item.description,
          quantity: Number(item.quantity) || 1,
          unit: item.unit || 'مورد',
          unit_price: Number(item.unitPrice) || 0,
          discount: Number(item.discount) || 0,
          total_price: Number(item.totalPrice) || 0,
          item_order: idx + 1
        }));

        const { error: itemsError } = await this.client
          .from('invoice_items')
          .insert(itemsPayload);

        if (itemsError) {
          console.error('[SupabaseAdapter] Failed to insert invoice items:', itemsError);
          const errMsg = itemsError.message || itemsError.details || 'خطا در ثبت اقلام فاکتور در سرور Supabase';
          throw new Error(errMsg);
        }
      }

      return invoice;
    } catch (e: any) {
      if (e?.message?.includes('Failed to fetch') || e?.name === 'TypeError') {
        throw new Error('ارتباط با سرور Supabase قطع شد (ERR_CONNECTION). لطفاً اتصال اینترنت خود را بررسی نمایید. سند موقتاً در حافظه مرورگر پشتیبان‌گیری شد.');
      }
      throw e;
    }
  }

  async deleteInvoice(id: string): Promise<void> {
    this.deleteLocalBackup('invoices', id);
    const { error } = await this.client.from('invoices').delete().eq('id', id);
    if (error) {
      console.error('[SupabaseAdapter] Failed to delete invoice:', error);
      throw new Error(error.message || error.details || 'خطا در حذف فاکتور از سرور');
    }
  }

  // --- Official Letters ---
  async getLetters(): Promise<OfficialLetter[]> {
    try {
      const { data, error } = await this.client
        .from('official_letters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const result: OfficialLetter[] = (data || []).map((l: any) => ({
        id: l.id,
        letterNumber: l.letter_number,
        letterDate: l.letter_date,
        attachment: l.attachment,
        type: l.type,
        subject: l.subject,
        recipientTitle: l.recipient_title,
        recipientName: l.recipient_name,
        recipientCompany: l.recipient_company,
        body: l.body,
        signeeTitle: l.signee_title,
        signeeName: l.signee_name,
        status: l.status,
        createdAt: l.created_at,
        updatedAt: l.updated_at
      }));

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('km_studio_letters', JSON.stringify(result));
        } catch {}
      }

      return result;
    } catch (e) {
      console.warn('[SupabaseAdapter] Failed to fetch letters, attempting local backup:', e);
      const backup = this.getLocalBackup<OfficialLetter>('letters');
      if (backup.length > 0) return backup;
      throw e;
    }
  }

  async getLetterById(id: string): Promise<OfficialLetter | null> {
    try {
      const { data, error } = await this.client
        .from('official_letters')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        const backup = this.getLocalBackup<OfficialLetter>('letters');
        return backup.find(l => l.id === id) || null;
      }

      return {
        id: data.id,
        letterNumber: data.letter_number,
        letterDate: data.letter_date,
        attachment: data.attachment,
        type: data.type,
        subject: data.subject,
        recipientTitle: data.recipient_title,
        recipientName: data.recipient_name,
        recipientCompany: data.recipient_company,
        body: data.body,
        signeeTitle: data.signee_title,
        signeeName: data.signee_name,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (e) {
      const backup = this.getLocalBackup<OfficialLetter>('letters');
      return backup.find(l => l.id === id) || null;
    }
  }

  async saveLetter(letter: OfficialLetter): Promise<OfficialLetter> {
    const letterId = isValidUUID(letter.id) ? letter.id : generateUUID();
    letter.id = letterId;

    const payload = {
      id: letterId,
      letter_number: letter.letterNumber,
      letter_date: letter.letterDate,
      attachment: letter.attachment || 'ندارد',
      type: letter.type,
      subject: letter.subject,
      recipient_title: letter.recipientTitle,
      recipient_name: letter.recipientName || null,
      recipient_company: letter.recipientCompany || null,
      body: letter.body,
      signee_title: letter.signeeTitle,
      signee_name: letter.signeeName,
      status: letter.status,
      updated_at: new Date().toISOString()
    };

    this.saveLocalBackup('letters', letter);

    try {
      const { error } = await this.client
        .from('official_letters')
        .upsert(payload);

      if (error) {
        console.error('[SupabaseAdapter] Failed to save letter:', error);
        throw new Error(error.message || error.details || 'خطا در ثبت نامه در سرور Supabase');
      }
      return letter;
    } catch (e: any) {
      if (e?.message?.includes('Failed to fetch') || e?.name === 'TypeError') {
        throw new Error('ارتباط با سرور Supabase قطع شد (ERR_CONNECTION). لطفاً وضعیت اینترنت را بررسی نمایید. نامه در حافظه محلی ذخیره گردید.');
      }
      throw e;
    }
  }

  async deleteLetter(id: string): Promise<void> {
    this.deleteLocalBackup('letters', id);
    const { error } = await this.client.from('official_letters').delete().eq('id', id);
    if (error) {
      console.error('[SupabaseAdapter] Failed to delete letter:', error);
      throw new Error(error.message || error.details || 'خطا در حذف نامه');
    }
  }

  // --- Clients ---
  async getClients(): Promise<Client[]> {
    try {
      const { data, error } = await this.client
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      const result: Client[] = (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        company: c.company,
        phone: c.phone,
        email: c.email,
        nationalId: c.national_id,
        economicCode: c.economic_code,
        postalCode: c.postal_code,
        address: c.address,
        createdAt: c.created_at,
        updatedAt: c.updated_at
      }));

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('km_studio_clients', JSON.stringify(result));
        } catch {}
      }

      return result;
    } catch (e) {
      console.warn('[SupabaseAdapter] Failed to fetch clients, attempting local backup:', e);
      const backup = this.getLocalBackup<Client>('clients');
      if (backup.length > 0) return backup;
      return [];
    }
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      const { data, error } = await this.client
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        const backup = this.getLocalBackup<Client>('clients');
        return backup.find(c => c.id === id) || null;
      }

      return {
        id: data.id,
        name: data.name,
        company: data.company,
        phone: data.phone,
        email: data.email,
        nationalId: data.national_id,
        economicCode: data.economic_code,
        postalCode: data.postal_code,
        address: data.address,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (e) {
      const backup = this.getLocalBackup<Client>('clients');
      return backup.find(c => c.id === id) || null;
    }
  }

  async saveClient(client: Client): Promise<Client> {
    const clientId = isValidUUID(client.id) ? client.id : generateUUID();
    client.id = clientId;

    const payload = {
      id: clientId,
      name: client.name,
      company: client.company || null,
      phone: client.phone || null,
      email: client.email || null,
      national_id: client.nationalId || null,
      economic_code: client.economicCode || null,
      postal_code: client.postalCode || null,
      address: client.address || null,
      updated_at: new Date().toISOString()
    };

    this.saveLocalBackup('clients', client);

    try {
      const { error } = await this.client.from('clients').upsert(payload);
      if (error) {
        console.error('[SupabaseAdapter] Failed to save client:', error);
        throw new Error(error.message || error.details || 'خطا در ثبت مشتری در سرور Supabase');
      }
      return client;
    } catch (e: any) {
      if (e?.message?.includes('Failed to fetch') || e?.name === 'TypeError') {
        throw new Error('ارتباط با سرور Supabase قطع شد (ERR_CONNECTION). اطلاعات مشتری در حافظه محلی مرورگر ذخیره گردید.');
      }
      throw e;
    }
  }

  async deleteClient(id: string): Promise<void> {
    this.deleteLocalBackup('clients', id);
    const { error } = await this.client.from('clients').delete().eq('id', id);
    if (error) {
      console.error('[SupabaseAdapter] Failed to delete client:', error);
      throw new Error(error.message || error.details || 'خطا در حذف مشتری');
    }
  }

  // --- Studio Profile ---
  async getStudioProfile(): Promise<StudioProfile> {
    try {
      const { data } = await this.client
        .from('studio_profile')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (data) {
        const prof: StudioProfile = {
          id: data.id,
          brandName: data.brand_name || 'KM Studio — استودیو مریدی',
          managerName: data.manager_name || 'کاظم مریدی',
          nationalId: data.national_id || '',
          economicCode: data.economic_code || '',
          registrationNumber: data.registration_number || '',
          phone: data.phone || '+989170284463',
          phoneDisplay: data.phone_display || '۰۹۱۷ ۰۲۸ ۴۴۶۳',
          email: data.email || 'kazem.codes@gmail.com',
          website: data.website || 'https://kazemmoridi.ir',
          shebaNumber: data.sheba_number || '',
          cardNumber: data.card_number || '',
          bankName: data.bank_name || 'بانک ملی ایران',
          address: data.address || 'هرمزگان، ایران',
          postalCode: data.postal_code || '',
          logoUrl: data.logo_url,
          stampSignatureUrl: data.stamp_signature_url
        };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('km_studio_profile', JSON.stringify(prof));
          } catch {}
        }
        return prof;
      }
    } catch (e) {
      console.warn('[SupabaseAdapter] getStudioProfile fetch error, using local/env:', e);
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('km_studio_profile');
          if (raw) return JSON.parse(raw);
        } catch {}
      }
    }

    return {
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
      bankName: 'بانک ملی ایران',
      address: 'هرمزگان، ایران — ارائه خدمات در سراسر کشور',
      postalCode: ''
    };
  }

  async saveStudioProfile(profile: StudioProfile): Promise<StudioProfile> {
    const payload = {
      brand_name: profile.brandName,
      manager_name: profile.managerName,
      national_id: profile.nationalId,
      economic_code: profile.economicCode,
      registration_number: profile.registrationNumber,
      phone: profile.phone,
      phone_display: profile.phoneDisplay,
      email: profile.email,
      website: profile.website,
      sheba_number: profile.shebaNumber,
      card_number: profile.cardNumber,
      bank_name: profile.bankName,
      address: profile.address,
      postal_code: profile.postalCode,
      logo_url: profile.logoUrl || null,
      stamp_signature_url: profile.stampSignatureUrl || null,
      updated_at: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('km_studio_profile', JSON.stringify(profile));
      } catch {}
    }

    try {
      if (profile.id && isValidUUID(profile.id)) {
        const { error } = await this.client.from('studio_profile').update(payload).eq('id', profile.id);
        if (error) throw new Error(error.message || error.details || 'خطا در بروزرسانی پروفایل استودیو');
      } else {
        const { data, error } = await this.client.from('studio_profile').insert(payload).select().single();
        if (error) throw new Error(error.message || error.details || 'خطا در ثبت اطلاعات پروفایل استودیو');
        if (data) profile.id = data.id;
      }

      return profile;
    } catch (e: any) {
      if (e?.message?.includes('Failed to fetch') || e?.name === 'TypeError') {
        throw new Error('ارتباط با سرور Supabase قطع شد (ERR_CONNECTION). تنظیمات در حافظه مرورگر ذخیره گردید.');
      }
      throw e;
    }
  }
}
