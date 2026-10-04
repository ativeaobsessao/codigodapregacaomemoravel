import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const client: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export const isSupabaseConfigured = !!client;

export function db(): SupabaseClient {
  if (!client) {
    throw new Error(
      "Banco não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
    );
  }
  return client;
}
