import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  (import.meta.env['VITE_SUPABASE_URL'] as string | undefined) ??
  "https://npmnewspddzqqahngapk.supabase.co";
export const SUPABASE_ANON_KEY =
  (import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbW5ld3NwZGR6cXFhaG5nYXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMTIzMzksImV4cCI6MjEwNjY4ODMzOX0.R1JgTTvNriq-R1S0AiYh-oeLJfNje0dPVfh6PBfQLuw";

const isBrowser = typeof window !== "undefined";

const client: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: isBrowser, autoRefreshToken: isBrowser, detectSessionInUrl: isBrowser },
});

export const isSupabaseConfigured = true;

export function db(): SupabaseClient {
  return client;
}
