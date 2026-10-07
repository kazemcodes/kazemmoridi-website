import type { Backend, CrudRepository } from "@/domain/ports";

const fail = async (): Promise<never> => {
  throw new Error("Backend not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
};

function repo<T extends { id: string }>(): CrudRepository<T> {
  return { list: async () => [], get: async () => null, save: fail, remove: fail };
}

/** Safe no-op backend used until real credentials are provided. */
export function createUnconfiguredBackend(): Backend {
  return {
    name: "unconfigured",
    configured: false,
    auth: {
      current: async () => null,
      isAdmin: async () => false,
      signIn: fail,
      signOut: async () => {},
      onChange: () => () => {},
    },
    clients: repo(),
    invoices: repo(),
    letters: repo(),
    profile: { get: async () => null, save: fail },
    messages: { submit: fail, list: async () => [], markRead: fail, remove: fail },
  };
}
