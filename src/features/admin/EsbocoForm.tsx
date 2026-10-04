import { useEffect, useState } from "react";
import { toast } from "sonner";
import { insertEsbocos, updateEsboco } from "@/features/esbocos/api";
import { FIELDS, type Esboco, type EsbocoInput, type Plano, type Status } from "@/features/esbocos/types";

type Values = Record<string, string>;

function toValues(e: Esboco | null): Values {
  const v: Values = { plano: e?.plano ?? "basico", status: e?.status ?? "publicado" };
  for (const f of FIELDS) {
    const raw = e?.[f.key];
    v[f.key] = Array.isArray(raw) ? raw.join(", ") : ((raw as string | null) ?? "");
  }
  return v;
}

function toRow(v: Values): Partial<EsbocoInput> {
  const row: Record<string, unknown> = { plano: v.plano as Plano, status: v.status as Status };
  for (const f of FIELDS) {
    const s = v[f.key]?.trim() ?? "";
    row[f.key] = f.kind === "tags" ? s.split(",").map((x) => x.trim()).filter(Boolean) : s || null;
  }
  return row as Partial<EsbocoInput>;
}

export function EsbocoForm({ editing, onDone, onCancel }: { editing: Esboco | null; onDone: () => void; onCancel: () => void }) {
  const [v, setV] = useState<Values>(() => toValues(null));
  const [busy, setBusy] = useState(false);
  useEffect(() => setV(toValues(editing)), [editing]);

  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));
  const words = (v.frase_final_cola ?? "").trim().split(/\s+/).filter(Boolean).length;

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!v.tema?.trim()) return toast.error("Preencha o tema.");
    if (words > 10) return toast.error("A frase final deve ter no máximo 10 palavras.");
    setBusy(true);
    try {
      if (editing) await updateEsboco(editing.id, toRow(v));
      else await insertEsbocos([toRow(v)]);
      toast.success(editing ? "Esboço atualizado!" : "Esboço publicado!");
      setV(toValues(null));
      onDone();
    } catch (e) {
      toast.error(`Erro ao salvar: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <p className="eyebrow text-muted-foreground">Forma B — formulário manual</p>
      <h2 className="font-serif text-3xl">{editing ? `Editando: ${editing.tema}` : "Novo esboço"}</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className={`space-y-1.5 ${f.kind === "textarea" ? "md:col-span-2" : ""}`}>
            <span className="eyebrow text-muted-foreground">
              {f.label}
              {f.key === "frase_final_cola" && <span className={words > 10 ? "text-destructive" : ""}> · {words}/10</span>}
            </span>
            {f.kind === "textarea" ? (
              <textarea rows={3} value={v[f.key]} onChange={(e) => set(f.key, e.target.value)} className="field-input" />
            ) : (
              <input value={v[f.key]} onChange={(e) => set(f.key, e.target.value)} className="field-input" />
            )}
          </label>
        ))}
        <label className="space-y-1.5">
          <span className="eyebrow text-muted-foreground">Plano</span>
          <select value={v.plano} onChange={(e) => set("plano", e.target.value)} className="field-input">
            <option value="basico">Básico</option>
            <option value="premium">Premium</option>
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="eyebrow text-muted-foreground">Status</span>
          <select value={v.status} onChange={(e) => set("status", e.target.value)} className="field-input">
            <option value="publicado">Publicado</option>
            <option value="rascunho">Rascunho</option>
          </select>
        </label>
      </div>
      <div className="flex gap-3">
        <button disabled={busy} className="btn-ink h-12 px-8">{busy ? "Salvando…" : editing ? "Salvar alterações" : "Publicar"}</button>
        {editing && <button type="button" onClick={onCancel} className="btn-line h-12">Cancelar edição</button>}
      </div>
    </form>
  );
}
