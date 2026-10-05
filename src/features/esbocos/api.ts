import { db } from "@/lib/supabase";
import type { Esboco, EsbocoInput } from "./types";

const TABLE = "esbocos";

function arr(v: string) {
  // PostgREST array literal, quoted to allow spaces/accents
  return `{"${v.replace(/"/g, "")}"}`;
}

function tagVariants(v: string) {
  const set = new Set([v, v.toLowerCase(), v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()]);
  return [...set];
}

export async function searchEsbocos(term: string, pill: string | null): Promise<Esboco[]> {
  let q = db().from(TABLE).select("*").eq("status", "publicado").order("created_at", { ascending: false });

  const t = term.trim().replace(/[,()%]/g, " ").trim();
  if (t) {
    const parts = [`tema.ilike.%${t}%`, `livro_biblico.ilike.%${t}%`];
    for (const v of tagVariants(t)) parts.push(`tags_dor.cs.${arr(v)}`, `tags_tema.cs.${arr(v)}`);
    q = q.or(parts.join(","));
  }
  if (pill) {
    const parts: string[] = [];
    for (const v of tagVariants(pill)) parts.push(`tags_dor.cs.${arr(v)}`, `tags_tema.cs.${arr(v)}`);
    q = q.or(parts.join(","));
  }
  const { data, error } = await q.limit(60);
  if (error) throw error;
  return (data ?? []) as Esboco[];
}

export async function getEsboco(id: string): Promise<Esboco | null> {
  const { data, error } = await db().from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Esboco | null;
}

export async function listEsbocos(page: number, pageSize: number) {
  const from = page * pageSize;
  const { data, error, count } = await db()
    .from(TABLE)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) throw error;
  return { rows: (data ?? []) as Esboco[], count: count ?? 0 };
}

export async function getCounts() {
  const c = async (plano?: string) => {
    let q = db().from(TABLE).select("id", { count: "exact", head: true });
    if (plano) q = q.eq("plano", plano);
    const { count, error } = await q;
    if (error) throw error;
    return count ?? 0;
  };
  const [total, basico, premium] = await Promise.all([c(), c("basico"), c("premium")]);
  return { total, basico, premium };
}

export async function insertEsbocos(rows: Partial<EsbocoInput>[]) {
  const { error } = await db().from(TABLE).insert(rows);
  if (error) throw error;
}

export async function updateEsboco(id: string, row: Partial<EsbocoInput>) {
  const { error } = await db().from(TABLE).update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteEsboco(id: string) {
  const { error } = await db().from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function listAllEsbocos() {
  const { data, error } = await db().from(TABLE).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Esboco[];
}
