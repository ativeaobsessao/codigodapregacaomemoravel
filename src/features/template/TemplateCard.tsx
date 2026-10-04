import { Link } from "@tanstack/react-router";

export const TEMPLATE_STEPS = [
  "Tema", "Objetivo", "Gancho da rotina", "Espelho bíblico", "Versículo-chave", "Contexto",
  "Desenvolvimento em 3 pontos", "Aplicação", "Pergunta", "Frase final que cola", "Oração", "Tempo",
];

export function TemplateCard() {
  return (
    <section className="rounded-lg bg-ink p-8 text-paper md:p-12">
      <span className="eyebrow inline-block rounded-full border border-gold px-3 py-1 text-[11px] text-gold">Método oficial</span>
      <h2 className="mt-6 max-w-2xl font-serif text-[28px] leading-tight md:text-[34px]">
        Template para uma pregação memorável
      </h2>
      <p className="mt-4 max-w-2xl text-[15px] opacity-75">
        12 passos que levam sua mensagem do gancho da rotina à frase que fica na memória: tema, objetivo,
        espelho bíblico, três pontos práticos, aplicação, oração e tempo.
      </p>
      <p className="mt-2 text-[12px] text-gold">Usado por mulheres em @codigodapregacaomemoravel</p>
      <div className="mt-8">
        <Link to="/template" className="inline-block rounded-lg bg-paper px-5 py-3 text-[14px] font-semibold text-ink transition-opacity hover:opacity-90">
          Usar este Template
        </Link>
      </div>
    </section>
  );
}
