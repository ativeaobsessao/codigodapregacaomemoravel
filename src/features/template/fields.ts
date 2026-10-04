export const IG_HANDLE = "@codigodapregacaomemoravel";
export const IG_URL = "https://instagram.com/codigodapregacaomemoravel";
export const SITE_URL = "codigodapregacaomemoravel.lovable.app";
export const STORAGE_KEY = "codigo_template_rascunho_v1";

export type TField = { key: string; label: string; kind: "input" | "textarea"; placeholder?: string };
export type TStep = { n: string; title: string; fields: TField[] };

export const STEPS: TStep[] = [
  { n: "01", title: "Tema", fields: [{ key: "tema", label: "Tema", kind: "input" }] },
  { n: "02", title: "Objetivo", fields: [{ key: "objetivo", label: "Objetivo", kind: "textarea" }] },
  { n: "03", title: "Gancho da Rotina", fields: [{ key: "gancho_rotina", label: "Gancho da rotina", kind: "textarea" }] },
  { n: "04", title: "Espelho Bíblico", fields: [
    { key: "espelho_texto_diz", label: "O que o texto diz", kind: "textarea" },
    { key: "espelho_aplicacao", label: "Aplicação que fazemos", kind: "textarea" },
  ] },
  { n: "05", title: "Versículo-Chave", fields: [{ key: "versiculo_chave", label: "Versículo-chave", kind: "textarea" }] },
  { n: "06", title: "Contexto Bíblico Essencial", fields: [{ key: "contexto_biblico", label: "Contexto bíblico", kind: "textarea" }] },
  { n: "07", title: "Desenvolvimento em 3 Pontos", fields: [
    { key: "ponto1_dor", label: "Ponto 1 — Dor", kind: "textarea" },
    { key: "ponto1_frase_pratica", label: "Ponto 1 — Frase prática", kind: "input" },
    { key: "ponto2_deus", label: "Ponto 2 — Deus", kind: "textarea" },
    { key: "ponto2_frase_pratica", label: "Ponto 2 — Frase prática", kind: "input" },
    { key: "ponto3_resposta", label: "Ponto 3 — Resposta", kind: "textarea" },
    { key: "ponto3_frase_pratica", label: "Ponto 3 — Frase prática", kind: "input" },
  ] },
  { n: "08", title: "Aplicação para Mulheres", fields: [{ key: "aplicacao_mulheres", label: "Aplicação para mulheres", kind: "textarea" }] },
  { n: "09", title: "Pergunta de Reflexão", fields: [{ key: "pergunta_reflexao", label: "Pergunta de reflexão", kind: "input" }] },
  { n: "10", title: "Frase Final que Cola", fields: [{ key: "frase_final_cola", label: "Frase final que cola", kind: "input" }] },
  { n: "11", title: "Oração Sugerida", fields: [{ key: "oracao_sugerida", label: "Oração sugerida", kind: "textarea" }] },
  { n: "12", title: "Tempo Estimado", fields: [{ key: "tempo_estimado", label: "Tempo estimado", kind: "input", placeholder: "10-15 min" }] },
];

export type Draft = Record<string, string>;
