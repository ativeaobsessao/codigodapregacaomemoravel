import { db } from "@/lib/supabase";
import { getEsboco } from "@/features/esbocos/api";
import { STEPS, type Draft } from "./fields";

export const AUTOSAVE_DELAY = 2000;
export type MemberDraft = {
  id: string;
  user_id: string;
  esboco_original_id: string;
  conteudo_json: Record<string, unknown>;
  updated_at: string;
  status: string;
};

export function draftProgress(content: Record<string, unknown>) {
  const keys = STEPS.flatMap((step) => step.fields.map((field) => field.key));
  const filled = keys.filter((key) => typeof content[key] === "string" && String(content[key]).trim().length > 0).length;
  return { filled, total: keys.length, percent: Math.round(filled / keys.length * 100) };
}

export function editableDraft(content: Record<string, unknown>): Draft {
  return Object.fromEntries(STEPS.flatMap((step) => step.fields.map(({ key }) => [key, typeof content[key] === "string" ? content[key] : ""])));
}

async function currentUserId() {
  const { data, error } = await db().auth.getUser();
  if (error || !data.user) throw new Error("Entre na plataforma para personalizar seu esboço.");
  return data.user.id;
}

export async function resumeMemberDraft(originalId: string): Promise<MemberDraft> {
  const userId = await currentUserId();
  const { data, error } = await db().from("rascunhos_usuario").select("*")
    .eq("user_id", userId).eq("esboco_original_id", originalId).neq("status", "arquivado")
    .order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  if (data) return data as MemberDraft;
  const original = await getEsboco(originalId);
  if (!original) throw new Error("Este esboço não está disponível no seu plano.");
  const result = await db().from("rascunhos_usuario").insert({
    user_id: userId, esboco_original_id: originalId, conteudo_json: original,
  }).select("*").single();
  if (result.error) throw result.error;
  return result.data as MemberDraft;
}

export async function loadMemberDraft(id: string): Promise<MemberDraft> {
  const userId = await currentUserId();
  const { data, error } = await db().from("rascunhos_usuario").select("*")
    .eq("id", id).eq("user_id", userId).neq("status", "arquivado").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Rascunho não encontrado ou indisponível para sua conta.");
  return data as MemberDraft;
}

export async function saveMemberDraft(id: string, content: Record<string, unknown>): Promise<MemberDraft> {
  const userId = await currentUserId();
  const { data, error } = await db().from("rascunhos_usuario")
    .update({ conteudo_json: content, updated_at: new Date().toISOString() })
    .eq("id", id).eq("user_id", userId).neq("status", "arquivado").select("*").single();
  if (error) throw error;
  return data as MemberDraft;
}