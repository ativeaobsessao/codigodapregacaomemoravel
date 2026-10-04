export type Plano = "basico" | "premium";
export type Status = "rascunho" | "publicado";

export interface Esboco {
  id: string;
  created_at: string;
  tema: string | null;
  objetivo: string | null;
  gancho_rotina: string | null;
  espelho_texto_diz: string | null;
  espelho_aplicacao: string | null;
  versiculo_chave: string | null;
  contexto_biblico: string | null;
  ponto1_dor: string | null;
  ponto1_frase_pratica: string | null;
  ponto2_deus: string | null;
  ponto2_frase_pratica: string | null;
  ponto3_resposta: string | null;
  ponto3_frase_pratica: string | null;
  aplicacao_mulheres: string | null;
  pergunta_reflexao: string | null;
  frase_final_cola: string | null;
  oracao_sugerida: string | null;
  tempo_estimado: string | null;
  tags_dor: string[] | null;
  tags_tema: string[] | null;
  livro_biblico: string | null;
  plano: Plano | null;
  status: Status | null;
  nota_5_estrelas: boolean | null;
}

export type EsbocoInput = Omit<Esboco, "id" | "created_at">;

/** Single source of truth for editable fields (form + JSON import). */
export const FIELDS: {
  key: keyof EsbocoInput;
  label: string;
  kind: "input" | "textarea" | "tags";
}[] = [
  { key: "tema", label: "Tema", kind: "input" },
  { key: "objetivo", label: "Objetivo", kind: "textarea" },
  { key: "gancho_rotina", label: "Gancho da rotina", kind: "textarea" },
  { key: "espelho_texto_diz", label: "Espelho — o que o texto diz", kind: "textarea" },
  { key: "espelho_aplicacao", label: "Espelho — aplicação", kind: "textarea" },
  { key: "versiculo_chave", label: "Versículo-chave", kind: "textarea" },
  { key: "contexto_biblico", label: "Contexto bíblico", kind: "textarea" },
  { key: "ponto1_dor", label: "Ponto 1 — a dor", kind: "textarea" },
  { key: "ponto1_frase_pratica", label: "Ponto 1 — frase prática", kind: "input" },
  { key: "ponto2_deus", label: "Ponto 2 — Deus", kind: "textarea" },
  { key: "ponto2_frase_pratica", label: "Ponto 2 — frase prática", kind: "input" },
  { key: "ponto3_resposta", label: "Ponto 3 — resposta", kind: "textarea" },
  { key: "ponto3_frase_pratica", label: "Ponto 3 — frase prática", kind: "input" },
  { key: "aplicacao_mulheres", label: "Aplicação para mulheres", kind: "textarea" },
  { key: "pergunta_reflexao", label: "Pergunta de reflexão", kind: "input" },
  { key: "frase_final_cola", label: "Frase final que cola (máx. 10 palavras)", kind: "input" },
  { key: "oracao_sugerida", label: "Oração sugerida", kind: "textarea" },
  { key: "tempo_estimado", label: "Tempo estimado", kind: "input" },
  { key: "tags_dor", label: "Tags de dor (vírgula)", kind: "tags" },
  { key: "tags_tema", label: "Tags de tema (vírgula)", kind: "tags" },
  { key: "livro_biblico", label: "Livro bíblico", kind: "input" },
];

export const FIELD_KEYS = new Set<string>([
  ...FIELDS.map((f) => f.key),
  "plano",
  "status",
  "nota_5_estrelas",
]);
