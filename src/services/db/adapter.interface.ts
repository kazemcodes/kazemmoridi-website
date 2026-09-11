import type { Client, Invoice, OfficialLetter, StudioProfile } from './types';

export interface IDatabaseAdapter {
  readonly providerName: string;

  // Invoices
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | null>;
  saveInvoice(invoice: Invoice): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;

  // Letters
  getLetters(): Promise<OfficialLetter[]>;
  getLetterById(id: string): Promise<OfficialLetter | null>;
  saveLetter(letter: OfficialLetter): Promise<OfficialLetter>;
  deleteLetter(id: string): Promise<void>;

  // Clients
  getClients(): Promise<Client[]>;
  getClientById(id: string): Promise<Client | null>;
  saveClient(client: Client): Promise<Client>;
  deleteClient(id: string): Promise<void>;

  // Studio Profile
  getStudioProfile(): Promise<StudioProfile>;
  saveStudioProfile(profile: StudioProfile): Promise<StudioProfile>;
}
