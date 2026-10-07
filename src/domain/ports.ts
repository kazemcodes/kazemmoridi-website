import type {
  AdminUser,
  Client,
  ContactMessage,
  Invoice,
  NewContactMessage,
  OfficialLetter,
  StudioProfile,
} from "./types";

/**
 * Ports: the only contracts UI and routes depend on.
 * Swap the backend by providing new implementations in src/infrastructure.
 */
export interface CrudRepository<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  remove(id: string): Promise<void>;
}

export type ClientsRepository = CrudRepository<Client>;
export type InvoicesRepository = CrudRepository<Invoice>;
export type LettersRepository = CrudRepository<OfficialLetter>;

export interface StudioProfileRepository {
  get(): Promise<StudioProfile | null>;
  save(profile: StudioProfile): Promise<StudioProfile>;
}

export interface MessagesRepository {
  /** Public: anyone may submit. */
  submit(message: NewContactMessage): Promise<void>;
  list(): Promise<ContactMessage[]>;
  markRead(id: string, read: boolean): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface AuthService {
  current(): Promise<AdminUser | null>;
  isAdmin(): Promise<boolean>;
  signIn(email: string, password: string): Promise<AdminUser>;
  signOut(): Promise<void>;
  onChange(cb: (user: AdminUser | null) => void): () => void;
}

export interface Backend {
  readonly name: string;
  readonly configured: boolean;
  auth: AuthService;
  clients: ClientsRepository;
  invoices: InvoicesRepository;
  letters: LettersRepository;
  profile: StudioProfileRepository;
  messages: MessagesRepository;
}
