import type {
  AuthService,
  Backend,
  CrudRepository,
  MessagesRepository,
  StudioProfileRepository,
  InvoicesRepository,
} from "@/domain/ports";
import type { AdminUser, ContactMessage, Invoice, InvoiceItem, StudioProfile } from "@/domain/types";
import { getSupabase } from "./client";
import { fromRow, toRow, unwrap } from "./mappers";

const db = () => getSupabase();

/** Generic table-backed repository for flat entities. */
function tableRepo<T extends { id: string }>(table: string, orderBy = "created_at"): CrudRepository<T> {
  return {
    async list() {
      const rows = unwrap(await db().from(table).select("*").order(orderBy, { ascending: false }));
      return (rows as Record<string, unknown>[]).map((r) => fromRow<T>(r));
    },
    async get(id) {
      const row = unwrap(await db().from(table).select("*").eq("id", id).maybeSingle());
      return row ? fromRow<T>(row as unknown as Record<string, unknown>) : null;
    },
    async save(entity) {
      const row = unwrap(
        await db().from(table).upsert(toRow(entity, ["createdAt"])).select("*").single(),
      );
      return fromRow<T>(row as unknown as Record<string, unknown>);
    },
    async remove(id) {
      unwrap(await db().from(table).delete().eq("id", id));
    },
  };
}

const invoices: InvoicesRepository = {
  async list() {
    const rows = unwrap(
      await db().from("invoices").select("*, invoice_items(*)").order("created_at", { ascending: false }),
    ) as Record<string, unknown>[];
    return rows.map(mapInvoice);
  },
  async get(id) {
    const row = unwrap(await db().from("invoices").select("*, invoice_items(*)").eq("id", id).maybeSingle());
    return row ? mapInvoice(row as unknown as Record<string, unknown>) : null;
  },
  async save(invoice) {
    unwrap(await db().from("invoices").upsert(toRow(invoice, ["items", "createdAt"])));
    unwrap(await db().from("invoice_items").delete().eq("invoice_id", invoice.id));
    if (invoice.items.length) {
      const rows = invoice.items.map((it, i) => ({ ...toRow(it), invoice_id: invoice.id, item_order: i }));
      unwrap(await db().from("invoice_items").insert(rows));
    }
    return invoice;
  },
  async remove(id) {
    unwrap(await db().from("invoices").delete().eq("id", id));
  },
};

function mapInvoice(row: Record<string, unknown>): Invoice {
  const { invoice_items, ...rest } = row;
  const items = ((invoice_items as Record<string, unknown>[]) ?? [])
    .sort((a, b) => Number(a["item_order"] ?? 0) - Number(b["item_order"] ?? 0))
    .map((r) => {
      const { invoiceId: _i, itemOrder: _o, ...item } = fromRow<InvoiceItem & { invoiceId: string; itemOrder: number }>(r);
      return { ...item, quantity: Number(item.quantity), unitPrice: Number(item.unitPrice), discount: Number(item.discount), totalPrice: Number(item.totalPrice) };
    });
  const inv = fromRow<Invoice>(rest);
  return {
    ...inv,
    subtotal: Number(inv.subtotal),
    discountAmount: Number(inv.discountAmount),
    taxPercent: Number(inv.taxPercent),
    taxAmount: Number(inv.taxAmount),
    totalAmount: Number(inv.totalAmount),
    items,
  };
}

const profile: StudioProfileRepository = {
  async get() {
    const row = unwrap(await db().from("studio_profile").select("*").limit(1).maybeSingle());
    return row ? fromRow<StudioProfile>(row as unknown as Record<string, unknown>) : null;
  },
  async save(p) {
    const row = unwrap(await db().from("studio_profile").upsert(toRow(p)).select("*").single());
    return fromRow<StudioProfile>(row as unknown as Record<string, unknown>);
  },
};

const messages: MessagesRepository = {
  async submit(m) {
    unwrap(await db().from("contact_messages").insert(toRow(m)));
  },
  async list() {
    const rows = unwrap(
      await db().from("contact_messages").select("*").order("created_at", { ascending: false }),
    ) as Record<string, unknown>[];
    return rows.map((r) => fromRow<ContactMessage>(r));
  },
  async markRead(id, read) {
    unwrap(await db().from("contact_messages").update({ read }).eq("id", id));
  },
  async remove(id) {
    unwrap(await db().from("contact_messages").delete().eq("id", id));
  },
};

const toUser = (u: { id: string; email?: string } | null | undefined): AdminUser | null =>
  u ? { id: u.id, email: u.email ?? "" } : null;

const auth: AuthService = {
  async current() {
    const { data } = await db().auth.getUser();
    return toUser(data.user);
  },
  async isAdmin() {
    const { data, error } = await db().rpc("is_admin");
    if (error) return false;
    return data === true;
  },
  async signIn(email, password) {
    const { data, error } = await db().auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return toUser(data.user)!;
  },
  async signOut() {
    await db().auth.signOut();
  },
  onChange(cb) {
    const { data } = db().auth.onAuthStateChange((_e, session) => cb(toUser(session?.user)));
    return () => data.subscription.unsubscribe();
  },
};

export function createSupabaseBackend(): Backend {
  return {
    name: "supabase",
    configured: true,
    auth,
    clients: tableRepo("clients"),
    invoices,
    letters: tableRepo("official_letters"),
    profile,
    messages,
  };
}
