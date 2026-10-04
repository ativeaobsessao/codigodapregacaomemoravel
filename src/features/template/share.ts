import { toast } from "sonner";
import { STEPS, STORAGE_KEY, IG_HANDLE, type Draft } from "./fields";
import type { Esboco } from "@/features/esbocos/types";

const KEYS = STEPS.flatMap((s) => s.fields.map((f) => f.key));

export function esbocoToDraft(e: Esboco): Draft {
  const d: Draft = {};
  for (const k of KEYS) d[k] = ((e as unknown as Record<string, unknown>)[k] as string | null) ?? "";
  return d;
}

export function hasDraft(): boolean {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (!r) return false;
    const d = JSON.parse(r)?.data ?? {};
    return Object.values(d).some((v) => typeof v === "string" && v.trim());
  } catch { return false; }
}

export function saveDraft(d: Draft, origemId?: string) {
  const t = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: d, savedAt: t, esboco_origem_id: origemId }));
}

export function getTextoCompletoWhatsApp(d: Draft): string {
  const out: string[] = [`*${(d['tema'] || "Minha Pregação").trim()}*`, ""];
  for (const s of STEPS) {
    out.push(`*${s.n} ${s.title.toUpperCase()}*`);
    for (const f of s.fields) {
      const v = d[f.key]?.trim() || "—";
      out.push(s.fields.length > 1 ? `_${f.label}:_ ${v}` : v);
    }
    out.push("");
  }
  out.push(`Código da Pregação Memorável • ${IG_HANDLE}`);
  return out.join("\n");
}

export async function enviarWhatsApp(d: Draft) {
  const text = getTextoCompletoWhatsApp(d);
  const title = d['tema'] || "Minha Pregação";
  if (typeof navigator.share === "function") {
    try { await navigator.share({ title, text }); return; }
    catch (err) { if ((err as Error)?.name === "AbortError") return; }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success("✅ PRONTO! ESBOÇO COMPLETO COPIADO! Agora abra seu WhatsApp e cole segurando e clicando em COLAR", { duration: 8000 });
    setTimeout(() => window.open("https://wa.me/", "_blank"), 1200);
  } catch {
    toast.error("Não foi possível copiar. Tente de novo.");
  }
}
