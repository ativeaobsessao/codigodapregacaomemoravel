import { useState } from "react";
import { copyText } from "@/features/esbocos/copy";

export const TEMPLATE_STEPS = [
  "Tema", "Objetivo", "Gancho da rotina", "Espelho bíblico", "Versículo-chave", "Contexto",
  "Desenvolvimento em 3 pontos", "Aplicação", "Pergunta", "Frase final que cola", "Oração", "Tempo",
];

const templateText = TEMPLATE_STEPS.map((s, i) => `${String(i + 1).padStart(2, "0")} ${s.toUpperCase()}\n`).join("\n");

export function TemplateCard() {
  const [open, setOpen] = useState(false);
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
      {open && (
        <ol className="mt-8 grid gap-x-8 gap-y-2 text-[14px] sm:grid-cols-2 md:grid-cols-3">
          {TEMPLATE_STEPS.map((s, i) => (
            <li key={s} className="flex gap-3 border-t border-paper/15 pt-2">
              <span className="text-gold">{String(i + 1).padStart(2, "0")}</span>{s}
            </li>
          ))}
        </ol>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => (open ? copyText(templateText, "Template copiado") : setOpen(true))}
          className="rounded-lg bg-paper px-5 py-3 text-[14px] font-semibold text-ink transition-opacity hover:opacity-90"
        >
          {open ? "Copiar template em branco" : "Usar este Template"}
        </button>
      </div>
    </section>
  );
}
