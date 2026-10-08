import { Link } from "@tanstack/react-router";
import type { Esboco } from "./types";
import { Tag } from "./Tag";

export function EsbocoCard({ e, locked = false }: { e: Esboco; locked?: boolean }) {
  const meta = [e.tempo_estimado, e.livro_biblico].filter(Boolean).join(" • ");
  const tags = [...(e.tags_dor ?? []), ...(e.tags_tema ?? [])].slice(0, 4);
  return (
    <Link
      to="/esboco/$id"
      params={{ id: e.id }}
      className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:border-ink"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="eyebrow text-muted-foreground">{meta || "Esboço"}</span>
        {locked && <span aria-label="Bloqueado no seu plano">🔒</span>}
      </div>
      <h3 className="font-serif text-[22px] leading-tight text-foreground">{e.tema}</h3>
      {tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-2">
          {tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      )}
    </Link>
  );
}
