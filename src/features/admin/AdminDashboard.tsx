import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCounts } from "@/features/esbocos/api";
import type { Esboco } from "@/features/esbocos/types";
import { JsonImport } from "./JsonImport";
import { EsbocoForm } from "./EsbocoForm";
import { EsbocosTable } from "./EsbocosTable";
import { BibliotecaAtual } from "./BibliotecaAtual";

export function AdminDashboard() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Esboco | null>(null);
  const counts = useQuery({ queryKey: ["esbocos", "counts"], queryFn: getCounts });
  const refresh = () => qc.invalidateQueries({ queryKey: ["esbocos"] });

  return (
    <main className="mx-auto max-w-5xl space-y-20 px-6 py-12">
      <header className="space-y-4">
        <h1 className="font-serif text-[36px] leading-tight">Central de Escala — Adicionar em 30s</h1>
        <p className="eyebrow text-muted-foreground">
          {counts.error ? (counts.error as Error).message : counts.data
            ? `Total: ${counts.data.total} | Básico: ${counts.data.basico} | Premium: ${counts.data.premium}`
            : "Carregando…"}
        </p>
      </header>

      <JsonImport onDone={refresh} />

      <div id="form">
        <EsbocoForm editing={editing} onDone={() => { setEditing(null); refresh(); }} onCancel={() => setEditing(null)} />
      </div>

      <BibliotecaAtual onChange={refresh} />

      <EsbocosTable
        onEdit={(e) => { setEditing(e); document.getElementById("form")?.scrollIntoView({ behavior: "smooth" }); }}
        onChange={refresh}
      />
    </main>
  );
}
