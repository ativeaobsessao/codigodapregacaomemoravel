import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy } from "lucide-react";
import type { Esboco } from "./types";
import { Tag } from "./Tag";
import { copyText } from "./copy";
import { ActionButton } from "@/features/template/ActionButton";
import { esbocoToDraft, saveDraft, hasDraft, enviarWhatsApp } from "@/features/template/share";
import { generatePdf } from "@/features/template/pdf";

function Section({ n, title, copy, children }: { n: string; title: string; copy?: string | null; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {n} {title}
        </h2>
        {copy && (
          <button onClick={() => copyText(copy, `${title} copiado`)} className="text-muted-foreground hover:text-foreground" aria-label={`Copiar ${title}`}>
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

/** Renders [gesto físico] segments in italics. */
function WithGestures({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-line">
      {text.split(/(\[[^\]]+\])/g).map((part, i) =>
        part.startsWith("[") ? <em key={i} className="text-muted-foreground">{part}</em> : part,
      )}
    </p>
  );
}

function P({ v }: { v: string | null }) {
  return v ? <p className="whitespace-pre-line">{v}</p> : <p className="text-muted-foreground">—</p>;
}

function Point({ n, body, phrase }: { n: number; body: string | null; phrase: string | null }) {
  return (
    <div className="space-y-2">
      <h3 className="font-serif text-xl">Ponto {n}</h3>
      <P v={body} />
      {phrase && <p><strong>O que dizer na prática:</strong> {phrase}</p>}
    </div>
  );
}

export function EsbocoView({ e }: { e: Esboco }) {
  const navigate = useNavigate();
  const [ask, setAsk] = useState(false);
  const tags = [...(e.tags_dor ?? []), ...(e.tags_tema ?? [])];
  const pontos = [
    [e.ponto1_dor, e.ponto1_frase_pratica],
    [e.ponto2_deus, e.ponto2_frase_pratica],
    [e.ponto3_resposta, e.ponto3_frase_pratica],
  ].map(([b, p], i) => `Ponto ${i + 1}\n${b ?? ""}\nO que dizer na prática: ${p ?? ""}`).join("\n\n");

  const usar = () => {
    saveDraft(esbocoToDraft(e), e.id);
    navigate({ to: "/template", search: { personalizar: e.id } });
  };

  return (
    <article className="mx-auto max-w-[720px] px-6 py-12">
      <div className="mb-8">
        <Link to="/" className="btn-line"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
      </div>

      <div className="mb-12 space-y-6">
        <ActionButton v="ink" onClick={() => (hasDraft() ? setAsk(true) : usar())}
          sub="Clique aqui e esse esboço vai abrir lá no seu passo a passo já preenchido. Você pode trocar o que quiser com suas palavras.">
          ✨ QUERO USAR ESSE ESBOÇO E COLOCAR MINHAS PALAVRAS
        </ActionButton>
        <ActionButton v="whats" onClick={() => enviarWhatsApp(esbocoToDraft(e))}
          sub="Vai abrir seu WhatsApp com o esboço inteirinho já escrito. É só escolher para quem enviar. Vai tudo, nada cortado.">
          💬 ENVIAR ESSE ESBOÇO COMPLETO PARA MEU WHATSAPP - VAI TUDO
        </ActionButton>
        <ActionButton v="line" onClick={() => generatePdf(esbocoToDraft(e))}
          sub="Baixa um arquivo bonito em PDF com a marca @codigodapregacaomemoravel para você levar para o púlpito.">
          📄 BAIXAR ESSE ESBOÇO EM PDF PARA IMPRIMIR
        </ActionButton>
      </div>

      {ask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-lg border border-ink bg-card p-6">
            <p className="text-[18px] font-semibold">Você já tem uma pregação salva. Quer apagar e usar essa nova?</p>
            <div className="mt-6 space-y-3">
              <button className="btn-ink min-h-14 w-full justify-center text-[16px] font-bold" onClick={usar}>SIM, QUERO USAR ESSA NOVA</button>
              <button className="btn-line min-h-14 w-full justify-center text-[16px] font-bold" onClick={() => setAsk(false)}>NÃO, MANTER A MINHA</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="eyebrow text-muted-foreground">{[e.tempo_estimado, e.livro_biblico].filter(Boolean).join(" • ")}</span>
      </div>
      <h1 className="font-serif text-[36px] leading-[1.15]">{e.tema}</h1>
      {tags.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>}

      <div className="mt-12 space-y-10">
        <Section n="01" title="Tema" copy={e.tema}><P v={e.tema} /></Section>
        <Section n="02" title="Objetivo" copy={e.objetivo}><P v={e.objetivo} /></Section>
        <Section n="03" title="Gancho da rotina" copy={e.gancho_rotina}>
          {e.gancho_rotina ? <WithGestures text={e.gancho_rotina} /> : <P v={null} />}
        </Section>
        <Section n="04" title="Espelho bíblico" copy={`O que o texto diz:\n${e.espelho_texto_diz ?? ""}\n\nAplicação que fazemos:\n${e.espelho_aplicacao ?? ""}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="eyebrow mb-2 text-muted-foreground">O que o texto diz</p><P v={e.espelho_texto_diz} />
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="eyebrow mb-2 text-muted-foreground">Aplicação que fazemos</p><P v={e.espelho_aplicacao} />
            </div>
          </div>
        </Section>
        <Section n="05" title="Versículo-chave" copy={e.versiculo_chave}>
          <blockquote className="border-l-2 border-ink bg-paper py-3 pl-5 font-serif text-xl leading-snug">{e.versiculo_chave}</blockquote>
        </Section>
        <Section n="06" title="Contexto" copy={e.contexto_biblico}><P v={e.contexto_biblico} /></Section>
        <Section n="07" title="Desenvolvimento em 3 pontos" copy={pontos}>
          <div className="space-y-8">
            <Point n={1} body={e.ponto1_dor} phrase={e.ponto1_frase_pratica} />
            <Point n={2} body={e.ponto2_deus} phrase={e.ponto2_frase_pratica} />
            <Point n={3} body={e.ponto3_resposta} phrase={e.ponto3_frase_pratica} />
          </div>
        </Section>
        <Section n="08" title="Aplicação" copy={e.aplicacao_mulheres}><P v={e.aplicacao_mulheres} /></Section>
        <Section n="09" title="Pergunta" copy={e.pergunta_reflexao}><P v={e.pergunta_reflexao} /></Section>
        <Section n="10" title="Frase final que cola" copy={e.frase_final_cola}>
          <p className="py-6 text-center font-serif text-[24px] leading-snug">
            <span className="mr-1 align-[-0.4em] text-5xl text-gold">“</span>{e.frase_final_cola}<span className="ml-1 align-[-0.4em] text-5xl text-gold">”</span>
          </p>
        </Section>
        <Section n="11" title="Oração" copy={e.oracao_sugerida}>
          <div className="rounded-lg bg-tag p-6"><P v={e.oracao_sugerida} /></div>
        </Section>
        <Section n="12" title="Tempo" copy={e.tempo_estimado}><P v={e.tempo_estimado} /></Section>
      </div>

      <div className="mt-16 border-t border-border pt-10 text-center">
        <Link to="/" className="btn-ink">Voltar para biblioteca</Link>
      </div>
    </article>
  );
}
