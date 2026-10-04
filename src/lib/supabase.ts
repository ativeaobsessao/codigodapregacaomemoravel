import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url =
  (import.meta.env['VITE_SUPABASE_URL'] as string | undefined) ??
  "https://npmnewspddzqqahngapk.supabase.co";
const key =
  (import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbW5ld3NwZGR6cXFhaG5nYXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMTIzMzksImV4cCI6MjEwNjY4ODMzOX0.R1JgTTvNriq-R1S0AiYh-oeLJfNje0dPVfh6PBfQLuw";

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
