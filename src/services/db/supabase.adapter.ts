import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { IDatabaseAdapter } from './adapter.interface';
import type { Client, Invoice, InvoiceItem, OfficialLetter, StudioProfile } from './types';

export class SupabaseAdapter implements IDatabaseAdapter {
  readonly providerName = 'Supabase';
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  // --- Invoices ---
  async getInvoices(): Promise<Invoice[]> {
    const { data: invoicesData, error: invError } = await this.client
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (invError) throw invError;
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

    return invoicesData.map((inv: any) => ({
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
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const { data: inv, error: invError } = await this.client
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (invError || !inv) return null;

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
  }

  async saveInvoice(invoice: Invoice): Promise<Invoice> {
    const invoicePayload = {
      id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      type: invoice.type,
      title: invoice.title,
      client_id: invoice.clientId || null,
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
      subtotal: invoice.subtotal,
      discount_amount: invoice.discountAmount,
      tax_percent: invoice.taxPercent,
      tax_amount: invoice.taxAmount,
      total_amount: invoice.totalAmount,
      payment_method: invoice.paymentMethod || null,
      notes: invoice.notes || null,
      terms: invoice.terms || null,
      updated_at: new Date().toISOString()
    };

    const { error: upsertError } = await this.client
      .from('invoices')
      .upsert(invoicePayload);

    if (upsertError) throw upsertError;

    // Replace items
    await this.client.from('invoice_items').delete().eq('invoice_id', invoice.id);

    if (invoice.items && invoice.items.length > 0) {
      const itemsPayload = invoice.items.map((item, idx) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit || 'مورد',
        unit_price: item.unitPrice,
        discount: item.discount || 0,
        total_price: item.totalPrice,
        item_order: idx + 1
      }));

      const { error: itemsError } = await this.client
        .from('invoice_items')
        .insert(itemsPayload);

      if (itemsError) throw itemsError;
    }

    return invoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    const { error } = await this.client.from('invoices').delete().eq('id', id);
    if (error) throw error;
  }

  // --- Official Letters ---
  async getLetters(): Promise<OfficialLetter[]> {
    const { data, error } = await this.client
      .from('official_letters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((l: any) => ({
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
  }

  async getLetterById(id: string): Promise<OfficialLetter | null> {
    const { data, error } = await this.client
      .from('official_letters')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
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
  }

  async saveLetter(letter: OfficialLetter): Promise<OfficialLetter> {
    const payload = {
      id: letter.id,
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

    const { error } = await this.client
      .from('official_letters')
      .upsert(payload);

    if (error) throw error;
    return letter;
  }

  async deleteLetter(id: string): Promise<void> {
    const { error } = await this.client.from('official_letters').delete().eq('id', id);
    if (error) throw error;
  }

  // --- Clients ---
  async getClients(): Promise<Client[]> {
    const { data, error } = await this.client
      .from('clients')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map((c: any) => ({
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
  }

  async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await this.client
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
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
  }

  async saveClient(client: Client): Promise<Client> {
    const payload = {
      id: client.id,
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

    const { error } = await this.client.from('clients').upsert(payload);
    if (error) throw error;
    return client;
  }

  async deleteClient(id: string): Promise<void> {
    const { error } = await this.client.from('clients').delete().eq('id', id);
    if (error) throw error;
  }

  // --- Studio Profile ---
  async getStudioProfile(): Promise<StudioProfile> {
    const { data } = await this.client
      .from('studio_profile')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) {
      return {
        id: data.id,
        brandName: data.brand_name || 'KM Studio — استودیو مریدی',
        managerName: data.manager_name || 'کاظم مریدی',
        nationalId: data.national_id || '---',
        economicCode: data.economic_code || '---',
        registrationNumber: data.registration_number || '---',
        phone: data.phone || '+989170284463',
        phoneDisplay: data.phone_display || '۰۹۱۷ ۰۲۸ ۴۴۶۳',
        email: data.email || 'kazem.codes@gmail.com',
        website: data.website || 'https://kazemmoridi.ir',
        shebaNumber: data.sheba_number || '',
        cardNumber: data.card_number || '',
        bankName: data.bank_name || 'بانک ملی ایران',
        address: data.address || 'هرمزگان، ایران',
        postalCode: data.postal_code || '---',
        logoUrl: data.logo_url,
        stampSignatureUrl: data.stamp_signature_url
      };
    }

    return {
      brandName: 'KM Studio — استودیو مریدی',
      managerName: 'کاظم مریدی',
      nationalId: '---',
      economicCode: '---',
      registrationNumber: '---',
      phone: '+989170284463',
      phoneDisplay: '۰۹۱۷ ۰۲۸ ۴۴۶۳',
      email: 'kazem.codes@gmail.com',
      website: 'https://kazemmoridi.ir',
      shebaNumber: '',
      cardNumber: '',
      bankName: 'بانک ملی ایران',
      address: 'هرمزگان، ایران — ارائه خدمات در سراسر کشور',
      postalCode: '---'
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

    if (profile.id) {
      await this.client.from('studio_profile').update(payload).eq('id', profile.id);
    } else {
      const { data } = await this.client.from('studio_profile').insert(payload).select().single();
      if (data) profile.id = data.id;
    }

    return profile;
  }
}
