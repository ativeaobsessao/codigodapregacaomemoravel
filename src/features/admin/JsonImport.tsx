import { useState } from "react";
import { toast } from "sonner";
import { insertEsbocos } from "@/features/esbocos/api";
import { FIELD_KEYS, type EsbocoInput, type Plano, type Status } from "@/features/esbocos/types";

function clean(raw: Record<string, unknown>, plano: Plano, status: Status): Partial<EsbocoInput> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) if (FIELD_KEYS.has(k)) out[k] = v;
  for (const k of ["tags_dor", "tags_tema"]) {
    if (typeof out[k] === "string") out[k] = (out[k] as string).split(",").map((s) => s.trim()).filter(Boolean);
  }
  return { ...out, plano, status } as Partial<EsbocoInput>;
}

export function JsonImport({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState("");
  const [plano, setPlano] = useState<Plano>("basico");
  const [status, setStatus] = useState<Status>("publicado");
  const [busy, setBusy] = useState(false);

  async function publish() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, ""));
    } catch (e) {
      toast.error(`JSON inválido: ${(e as Error).message}`);
      return;
    }
    const list = Array.isArray(parsed) ? parsed : [parsed];
    if (!list.length || list.some((x) => !x || typeof x !== "object")) {
      toast.error("O JSON precisa ser um objeto ou uma lista de objetos.");
      return;
    }
    setBusy(true);
    try {
      await insertEsbocos(list.map((r) => clean(r as Record<string, unknown>, plano, status)));
      toast.success(list.length > 1 ? `${list.length} esboços publicados!` : "Esboço publicado!");
      setText("");
      onDone();
    } catch (e) {
      toast.error(`Erro ao salvar: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4">
      <p className="eyebrow text-muted-foreground">Forma A — mais rápida</p>
      <h2 className="font-serif text-3xl">Colar JSON</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cole aqui o JSON do GPT V5.0 - pode ser objeto único ou array"
        className="field-input h-[300px] font-mono text-[13px]"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select value={plano} onChange={(e) => setPlano(e.target.value as Plano)} className="field-input w-auto">
          <option value="basico">Básico</option>
          <option value="premium">Premium</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="field-input w-auto">
          <option value="publicado">Publicado</option>
          <option value="rascunho">Rascunho</option>
        </select>
        <button onClick={publish} disabled={busy || !text.trim()} className="btn-ink h-12 px-8 text-[15px]">
          {busy ? "Publicando…" : "Publicar Agora"}
        </button>
      </div>
    </section>
  );
}
