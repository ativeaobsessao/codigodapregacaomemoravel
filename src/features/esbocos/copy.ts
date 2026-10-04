import { toast } from "sonner";
import type { Esboco } from "./types";

export async function copyText(text: string, label = "Copiado") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch {
    toast.error("Não foi possível copiar");
  }
}

export function esbocoToText(e: Esboco): string {
  const s = (t: string, v?: string | null) => (v ? `${t}\n${v}\n` : "");
  return [
    s("01 TEMA", e.tema),
    s("02 OBJETIVO", e.objetivo),
    s("03 GANCHO DA ROTINA", e.gancho_rotina),
    s("04 ESPELHO BÍBLICO — O QUE O TEXTO DIZ", e.espelho_texto_diz),
    s("04 ESPELHO BÍBLICO — APLICAÇÃO QUE FAZEMOS", e.espelho_aplicacao),
    s("05 VERSÍCULO-CHAVE", e.versiculo_chave),
    s("06 CONTEXTO", e.contexto_biblico),
    s("07 PONTO 1", [e.ponto1_dor, e.ponto1_frase_pratica && `O que dizer na prática: ${e.ponto1_frase_pratica}`].filter(Boolean).join("\n")),
    s("07 PONTO 2", [e.ponto2_deus, e.ponto2_frase_pratica && `O que dizer na prática: ${e.ponto2_frase_pratica}`].filter(Boolean).join("\n")),
    s("07 PONTO 3", [e.ponto3_resposta, e.ponto3_frase_pratica && `O que dizer na prática: ${e.ponto3_frase_pratica}`].filter(Boolean).join("\n")),
    s("08 APLICAÇÃO", e.aplicacao_mulheres),
    s("09 PERGUNTA", e.pergunta_reflexao),
    s("10 FRASE FINAL QUE COLA", e.frase_final_cola),
    s("11 ORAÇÃO", e.oracao_sugerida),
    s("12 TEMPO", e.tempo_estimado),
  ].filter(Boolean).join("\n");
}
