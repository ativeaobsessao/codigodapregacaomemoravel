import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getEsboco } from "@/features/esbocos/api";
import { EsbocoView } from "@/features/esbocos/EsbocoView";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useAuth } from "@/features/auth/useAuth";

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
  const { user, loading } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["esboco", id, user?.id ?? "anon"],
    queryFn: () => getEsboco(id),
    enabled: !!user,
  });

  const msg = (texto: string, link: "/login" | "/") => (
    <div className="py-24 text-center">
      <p className="font-serif text-2xl">{texto}</p>
      <Link to={link} className="btn-ink mt-6">{link === "/login" ? "Acessar Plataforma" : "Voltar para biblioteca"}</Link>
    </div>
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      {loading || (user && isLoading) ? (
        <p className="py-24 text-center text-muted-foreground">Carregando…</p>
      ) : !user ? (
        msg("🔒 Entre na plataforma para ver este esboço.", "/login")
      ) : error ? (
        msg((error as Error).message, "/")
      ) : !data ? (
        msg("🔒 Este esboço é do plano Premium.", "/")
      ) : (
        <EsbocoView e={data} />
      )}
      <SiteFooter />
    </div>
  );
}
