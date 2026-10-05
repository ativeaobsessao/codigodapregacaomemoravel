import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Código da Pregação Memorável" },
      { name: "description", content: "Como tratamos seus dados pessoais conforme a LGPD." },
      { property: "og:title", content: "Política de Privacidade" },
      { property: "og:description", content: "Como tratamos seus dados conforme a LGPD." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl space-y-5 px-6 py-16 text-[15px] leading-relaxed">
        <h1 className="font-serif text-4xl">Política de Privacidade</h1>
        <p>Esta política explica como o Código da Pregação Memorável trata seus dados, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
        <h2 className="font-serif text-2xl">Dados que coletamos</h2>
        <p>E-mail informado na compra, plano adquirido, foto de perfil (opcional) e a data em que você aceitou esta política.</p>
        <h2 className="font-serif text-2xl">Para que usamos</h2>
        <p>Exclusivamente para liberar seu acesso à plataforma conforme o plano comprado. Não vendemos nem compartilhamos seus dados para marketing.</p>
        <h2 className="font-serif text-2xl">Com quem compartilhamos</h2>
        <p>Com a plataforma de pagamento (Kiwify) para confirmar a compra e com o provedor de hospedagem do banco de dados, apenas para operar o serviço.</p>
        <h2 className="font-serif text-2xl">Seus direitos</h2>
        <p>Você pode acessar, corrigir ou pedir a exclusão dos seus dados a qualquer momento em Minha Conta → "Solicitar exclusão dos meus dados", ou pelo Instagram @codigodapregacaomemoravel.</p>
        <h2 className="font-serif text-2xl">Armazenamento</h2>
        <p>Seus dados são mantidos enquanto sua conta estiver ativa e excluídos após pedido de exclusão, salvo obrigação legal.</p>
      </main>
      <SiteFooter />
    </div>
  ),
});
