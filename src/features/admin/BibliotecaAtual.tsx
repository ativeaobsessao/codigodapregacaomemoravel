import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteEsboco, listAllEsbocos } from "@/features/esbocos/api";
import type { Esboco } from "@/features/esbocos/types";

const trunc = (s: string, n = 60) => (s.length > n ? s.slice(0, n) + "…" : s);

export function BibliotecaAtual({ onChange }: { onChange: () => void }) {
  const qc = useQueryClient();
  const { data, error, isLoading } = useQuery({ queryKey: ["esbocos", "all"], queryFn: listAllEsbocos });
  const [q, setQ] = useState("");
  const [target, setTarget] = useState<Esboco | null>(null);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (data ?? []).filter((e) => !t || (e.tema ?? "").toLowerCase().includes(t));
  }, [data, q]);

  async function confirmDelete() {
    if (!target) return;
    setBusy(true);
    try {
      await deleteEsboco(target.id);
      qc.setQueryData<Esboco[]>(["esbocos", "all"], (old) => (old ?? []).filter((e) => e.id !== target.id));
      toast.success("✅ Esboço apagado com sucesso!", { position: "top-center", duration: 4000 });
      setTarget(null);
      onChange();
    } catch (err) {
      toast.error(`Erro ao apagar: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  const empty = data && data.length === 0;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-serif text-[34px] leading-tight">📚 BIBLIOTECA ATUAL - Todos os esboços que estão no ar</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">Aqui você vê todos os esboços que já subiu e pode apagar se colou errado.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar esboço para apagar... Ex: ansiedade" className="field-input flex-1" />
        <button
          disabled={!data?.length}
          onClick={() => data?.[0] && setTarget(data[0])}
          className="rounded-lg border border-destructive bg-card px-4 py-2 text-[14px] font-semibold text-destructive disabled:opacity-40"
        >
          🗑️ Apagar último enviado
        </button>
      </div>

      {error && <p className="text-destructive">{(error as Error).message}</p>}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-left text-[14px]">
          <thead className="eyebrow border-b border-border text-muted-foreground">
            <tr><th className="p-4">Tema</th><th className="p-4">Tempo</th><th className="p-4">Plano</th><th className="p-4">Data</th><th className="p-4 text-right">Ações</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Carregando…</td></tr>}
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="p-4" title={e.tema}>{trunc(e.tema ?? "")}</td>
                <td className="p-4 text-muted-foreground">{e.tempo_estimado ?? "—"}</td>
                <td className="p-4 text-muted-foreground">{e.plano}</td>
                <td className="whitespace-nowrap p-4 text-muted-foreground">{new Date(e.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="whitespace-nowrap p-4 text-right">
                  <a href={`/esboco/${e.id}`} target="_blank" rel="noreferrer" className="btn-line mr-2">👁️ Ver</a>
                  <button onClick={() => setTarget(e)} className="rounded-lg border border-destructive px-3 py-1.5 text-[13px] font-semibold text-destructive">🗑️ Apagar</button>
                </td>
              </tr>
            ))}
            {empty && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum esboço publicado ainda.</td></tr>}
            {data && !empty && rows.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum esboço encontrado para essa busca.</td></tr>}
          </tbody>
        </table>
      </div>

      {target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-4" onClick={() => !busy && setTarget(null)}>
          <div className="w-full max-w-lg space-y-5 rounded-lg border border-border bg-background p-8" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className="font-serif text-[32px] leading-tight">Tem certeza que quer apagar?</h3>
            <p className="text-[17px]">"{target.tema}"</p>
            <p className="text-[14px] text-destructive">Essa ação apaga da plataforma para sempre e não pode ser desfeita.</p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button disabled={busy} onClick={() => setTarget(null)} className="rounded-lg border border-border bg-muted px-5 py-3 text-[15px]">Cancelar</button>
              <button disabled={busy} onClick={confirmDelete} className="rounded-lg bg-destructive px-5 py-3 text-[15px] font-bold text-destructive-foreground disabled:opacity-60">
                {busy ? "Apagando…" : "SIM, QUERO APAGAR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
