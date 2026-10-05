import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { TemplateCard } from "@/features/template/TemplateCard";
import { SearchBar, FilterPills } from "@/features/search/SearchBar";
import { useEsbocosSearch } from "@/features/search/useEsbocosSearch";
import { EsbocoCard } from "@/features/esbocos/EsbocoCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Código da Pregação Memorável — Biblioteca de esboços" },
      { name: "description", content: "Encontre em segundos o esboço certo para a dor que você vai pregar. Biblioteca editorial para mulheres pregadoras." },
      { property: "og:title", content: "Código da Pregação Memorável" },
      { property: "og:description", content: "Esboços de pregação organizados por dor, prontos para usar." },
    ],
  }),
  component: Home,
});

function Home() {
  const [term, setTerm] = useState("");
  const [pill, setPill] = useState<string | null>(null);
  const { data, isLoading, error } = useEsbocosSearch(term, pill);
  const query = term || pill || "";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-20 px-6 pt-12">
        <TemplateCard />

        <section className="mx-auto max-w-3xl space-y-6 text-center">
          <h1 className="font-serif text-[36px] leading-tight md:text-[40px]">Qual temática você vai pregar?</h1>
          <SearchBar value={term} onChange={setTerm} />
          <FilterPills active={pill} onSelect={setPill} />
        </section>

        <section>
          {error ? (
            <p className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
              {(error as Error).message}
            </p>
          ) : isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[0, 1, 2].map((i) => <div key={i} className="h-44 animate-pulse rounded-lg border border-border bg-card" />)}
            </div>
          ) : data && data.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {data.map((e) => <EsbocoCard key={e.id} e={e} />)}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card px-6 py-16 text-center">
              <p className="font-serif text-2xl">
                {query ? <>Nenhum esboço encontrado para “{query}”.</> : "A biblioteca ainda está vazia."}
              </p>
              <p className="mt-2 text-muted-foreground">Tente ansiedade, medo, oração.</p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
