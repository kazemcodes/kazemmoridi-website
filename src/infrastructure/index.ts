import type { Backend } from "@/domain/ports";
import { supabaseConfig } from "./supabase/client";
import { createSupabaseBackend } from "./supabase/backend";
import { createUnconfiguredBackend } from "./unconfigured";

/**
 * Composition root. This is the ONLY place that knows which backend is used.
 * To switch providers, implement `Backend` (see src/domain/ports.ts) and return it here.
 */
let backend: Backend | null = null;

export function getBackend(): Backend {
  if (!backend) backend = supabaseConfig().configured ? createSupabaseBackend() : createUnconfiguredBackend();
  return backend;
}
