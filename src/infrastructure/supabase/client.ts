import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function supabaseConfig() {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
  const key = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? import.meta.env["VITE_SUPABASE_ANON_KEY"]) as
    | string
    | undefined;
  return { url, key, configured: Boolean(url && key) };
}

/** Lazily creates the browser client. Publishable key only — RLS protects data. */
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const { url, key } = supabaseConfig();
  if (!url || !key) throw new Error("Supabase is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
  client = createClient(url, key, {
    auth: { persistSession: typeof window !== "undefined", autoRefreshToken: true },
  });
  return client;
}
