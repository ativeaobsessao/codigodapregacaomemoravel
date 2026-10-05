import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Código da Pregação Memorável" },
      { name: "description", content: "Regras de uso da biblioteca de esboços." },
      { property: "og:title", content: "Termos de Uso" },
      { property: "og:description", content: "Regras de uso da biblioteca de esboços." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl space-y-5 px-6 py-16 text-[15px] leading-relaxed">
        <h1 className="font-serif text-4xl">Termos de Uso</h1>
        <p>Ao acessar o Código da Pregação Memorável você concorda com estes termos.</p>
        <h2 className="font-serif text-2xl">Acesso</h2>
        <p>O acesso é pessoal e intransferível, liberado conforme o plano comprado (Básico ou Premium). Não compartilhe sua senha.</p>
        <h2 className="font-serif text-2xl">Uso do conteúdo</h2>
        <p>Você pode usar, adaptar e pregar os esboços livremente. Não é permitido revender, redistribuir em massa ou publicar a biblioteca em outros sites.</p>
        <h2 className="font-serif text-2xl">Pagamento e reembolso</h2>
        <p>Pagamentos e reembolsos seguem as regras da Kiwify e do Código de Defesa do Consumidor (7 dias de garantia).</p>
        <h2 className="font-serif text-2xl">Encerramento</h2>
        <p>O acesso pode ser suspenso em caso de uso indevido, reembolso ou pedido de exclusão de dados.</p>
        <h2 className="font-serif text-2xl">Contato</h2>
        <p>Instagram @codigodapregacaomemoravel.</p>
      </main>
      <SiteFooter />
    </div>
  ),
});
