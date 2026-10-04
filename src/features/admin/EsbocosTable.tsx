import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteEsboco, listEsbocos } from "@/features/esbocos/api";
import type { Esboco } from "@/features/esbocos/types";
import { PlanoBadge } from "@/features/esbocos/Tag";

const PAGE_SIZE = 10;

export function EsbocosTable({ onEdit, onChange }: { onEdit: (e: Esboco) => void; onChange: () => void }) {
  const [page, setPage] = useState(0);
  const { data, error } = useQuery({
    queryKey: ["esbocos", "list", page],
    queryFn: () => listEsbocos(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });
  const pages = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE));

  async function remove(e: Esboco) {
    if (!confirm(`Excluir "${e.tema}"?`)) return;
    try {
      await deleteEsboco(e.id);
      toast.success("Esboço excluído");
      onChange();
    } catch (err) {
      toast.error(`Erro ao excluir: ${(err as Error).message}`);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="font-serif text-3xl">Esboços no banco</h2>
      {error && <p className="text-destructive">{(error as Error).message}</p>}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-left text-[14px]">
          <thead className="eyebrow border-b border-border text-muted-foreground">
            <tr><th className="p-4">Tema</th><th className="p-4">Tags de dor</th><th className="p-4">Plano</th><th className="p-4">Status</th><th className="p-4 text-right">Ações</th></tr>
          </thead>
          <tbody>
            {data?.rows.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="p-4 font-serif text-[17px]">{e.tema}</td>
                <td className="p-4 text-muted-foreground">{(e.tags_dor ?? []).join(", ")}</td>
                <td className="p-4"><PlanoBadge plano={e.plano} /></td>
                <td className="p-4 text-muted-foreground">{e.status}</td>
                <td className="whitespace-nowrap p-4 text-right">
                  <button onClick={() => onEdit(e)} className="btn-line mr-2">Editar</button>
                  <button onClick={() => remove(e)} className="btn-line text-destructive">Excluir</button>
                </td>
              </tr>
            ))}
            {data && data.rows.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum esboço ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-[13px] text-muted-foreground">
        <span>Página {page + 1} de {pages}</span>
        <div className="flex gap-2">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="btn-line disabled:opacity-40">Anterior</button>
          <button disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)} className="btn-line disabled:opacity-40">Próxima</button>
        </div>
      </div>
    </section>
  );
}
