import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getEsboco } from "@/features/esbocos/api";
import { EsbocoView } from "@/features/esbocos/EsbocoView";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/esboco/$id")({
  head: () => ({
    meta: [
      { title: "Esboço — Código da Pregação Memorável" },
      { name: "description", content: "Esboço completo em 12 passos, pronto para pregar e copiar." },
      { property: "og:title", content: "Esboço — Código da Pregação Memorável" },
      { property: "og:description", content: "Esboço completo em 12 passos, pronto para pregar." },
    ],
  }),
  component: EsbocoPage,
});

function EsbocoPage() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery({ queryKey: ["esboco", id], queryFn: () => getEsboco(id) });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      {isLoading ? (
        <p className="py-24 text-center text-muted-foreground">Carregando…</p>
      ) : error || !data ? (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl">{error ? (error as Error).message : "Esboço não encontrado."}</p>
          <Link to="/" className="btn-ink mt-6">Voltar para biblioteca</Link>
        </div>
      ) : (
        <EsbocoView e={data} />
      )}
      <SiteFooter />
    </div>
  );
}
