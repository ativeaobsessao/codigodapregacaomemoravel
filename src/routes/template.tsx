import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Instagram, Download, Check, ChevronDown } from "lucide-react";
import { STEPS, STORAGE_KEY, IG_HANDLE, IG_URL, type Draft } from "@/features/template/fields";
import { ANA_EXAMPLE, FIELD_HELP } from "@/features/template/example";
import { generatePdf } from "@/features/template/pdf";
import { SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/template")({
  head: () => ({
    meta: [
      { title: "Template Oficial — Código da Pregação Memorável" },
      { name: "description", content: "Preencha os 12 passos da sua pregação memorável com salvamento automático e baixe em PDF." },
      { property: "og:title", content: "Template Oficial — Código da Pregação Memorável" },
      { property: "og:description", content: "Editor dos 12 passos com auto-save e PDF premium." },
    ],
  }),
  component: TemplatePage,
});

const now = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function readStore(): { data: Draft; savedAt?: string } | null {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

function TemplatePage() {
  const [draft, setDraft] = useState<Draft>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [showEx, setShowEx] = useState(false);
  const [openHelp, setOpenHelp] = useState<string | null>(null);
  const loaded = useRef(false);

  const save = (d: Draft) => {
    const t = now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: d, savedAt: t }));
    setSavedAt(t);
  };

  useEffect(() => {
    const s = readStore();
    if (s) { setDraft(s.data ?? {}); setSavedAt(s.savedAt ?? null); }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const id = setTimeout(() => save(draft), 800);
    return () => clearTimeout(id);
  }, [draft]);

  const restore = () => {
    const s = readStore();
    if (s) { setDraft(s.data ?? {}); toast.success("Rascunho restaurado"); } else toast.error("Nenhum rascunho salvo");
  };
  const clear = () => {
    if (!confirm("Apagar todo o conteúdo do template?")) return;
    localStorage.removeItem(STORAGE_KEY);
    loaded.current = false;
    setDraft({});
    setSavedAt(null);
    setTimeout(() => (loaded.current = true), 900);
    toast.success("Template limpo");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 px-6 py-5">
          <Link to="/" className="btn-line"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
          <a href={IG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] font-medium hover:text-gold">
            <Instagram className="h-4 w-4" /> {IG_HANDLE}
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-14">
        <h1 className="font-serif text-[36px] leading-tight md:text-[44px]">Template para uma pregação memorável</h1>
        <p className="mt-4 text-[18px] text-foreground">
          Preencha as 12 caixinhas abaixo com suas palavras e baixe sua pregação pronta em PDF. Tudo salva sozinho.
        </p>

        {/* BLOCO 1 */}
        <section className="mt-20">
          <h2 className="font-serif text-[30px]">Como funciona?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { i: "📝", t: "1. Você Escreve", d: "Digite suas ideias em cada uma das 12 caixinhas. Não precisa ser bonito, escreva do seu jeito." },
              { i: "💾", t: "2. Salva Sozinho", d: "Pode fechar o celular. Quando voltar, tudo estará aqui. Não apaga.", badge: true },
              { i: "📄", t: "3. Baixa em PDF", d: "No final, clique no botão preto e baixe sua pregação linda em PDF com sua marca." },
            ].map((c) => (
              <div key={c.t} className="rounded-lg border border-border bg-card p-6">
                <div className="text-[52px] leading-none">{c.i}</div>
                <h3 className="mt-4 text-[19px] font-semibold">{c.t}</h3>
                <p className="mt-2 text-[16px] text-muted-foreground">{c.d}</p>
                {c.badge && (
                  <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-success-soft px-3 py-1 text-[13px] font-medium text-success">
                    <Check className="h-4 w-4" /> Salvo automaticamente
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BLOCO 2 */}
        <section className="mt-20">
          <h2 className="font-serif text-[30px]">Toque para ver um exemplo real já preenchido 👇</h2>
          <p className="mt-2 text-[17px] text-muted-foreground">
            Esse é um exemplo da nossa aluna Ana, 47 anos, que tinha pavor de pregar. Veja como ela preencheu cada um dos 12 passos.
          </p>
          <div className="mt-6 rounded-lg border border-ink bg-card">
            <button onClick={() => setShowEx((v) => !v)} aria-expanded={showEx}
              className="flex w-full items-center justify-between gap-4 p-6 text-left">
              <span className="text-[18px] font-semibold">{showEx ? "Fechar o exemplo da Ana" : "👉 Abrir o exemplo completo da Ana"}</span>
              <ChevronDown className={`h-6 w-6 shrink-0 transition-transform ${showEx ? "rotate-180" : ""}`} />
            </button>
            {showEx && (
              <div className="border-t border-ink px-6 pb-8">
                {ANA_EXAMPLE.map((s) => (
                  <article key={s.n} className="border-b border-border py-8 last:border-b-0">
                    <div className="flex items-baseline gap-4">
                      <span className="font-serif text-[48px] leading-none text-gold">{s.n}</span>
                      <h3 className="text-[20px] font-bold">{s.emoji} {s.title}</h3>
                    </div>
                    <p className="mt-3 text-[15px] text-muted-foreground"><b>O que é esse passo?</b> {s.what}</p>
                    <div className="mt-4 rounded-lg bg-tag p-5">
                      <span className="eyebrow block text-muted-foreground">Como Ana preencheu</span>
                      <div className="mt-2 space-y-3">
                        {s.items.map((it, k) => (
                          <div key={k}>
                            {it.label && <span className="block text-[13px] font-semibold uppercase tracking-wide">{it.label}</span>}
                            <p className="font-serif text-[20px] leading-snug">{it.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-[14px]">💡 <b>Por que isso é importante?</b> {s.why}</p>
                  </article>
                ))}
                <div className="mt-4 rounded-lg border border-success bg-success-soft p-5 text-[17px] text-success">
                  <b>Entendeu? Agora é sua vez.</b> É só fazer igual a Ana fez acima, mas com sua mensagem. Role para baixo e preencha. 👇
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BLOCO 3 */}
        <section className="mt-20">
          <h2 className="font-serif text-[34px] leading-tight">Agora é sua vez - Preencha sua pregação abaixo</h2>
          <p className="mt-2 text-[17px] text-muted-foreground">Escreva com suas palavras. Pode ser simples. Tudo salva sozinho.</p>

          <div className="sticky top-0 z-10 -mx-6 mt-6 flex flex-wrap items-center gap-3 border-b border-border bg-background px-6 py-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-3 py-1 text-[13px] font-medium text-success">
              <Check className="h-4 w-4" /> {savedAt ? `Salvo automaticamente • ${savedAt}` : "Salvamento automático ativo"}
            </span>
            <button className="btn-line" onClick={() => { save(draft); toast.success("Salvo"); }}>Salvar Agora</button>
            <button className="btn-line" onClick={restore}>Restaurar Rascunho</button>
            <button className="btn-line" onClick={clear}>Limpar Tudo</button>
          </div>

          <div className="mt-8 space-y-12">
            {STEPS.map((s) => (
              <section key={s.n} className="border-t border-border pt-8">
                <h3 className="mb-4 flex items-baseline gap-3">
                  <span className="font-serif text-[40px] leading-none text-gold">{s.n}</span>
                  <span className="text-[16px] font-bold uppercase tracking-[0.06em]">{s.title}</span>
                </h3>
                <div className="space-y-5">
                  {s.fields.map((f) => {
                    const h = FIELD_HELP[f.key];
                    const open = openHelp === f.key;
                    return (
                      <div key={f.key}>
                        <div className="mb-2 flex items-center gap-2">
                          <label htmlFor={f.key} className="text-[17px] font-medium">{h?.q ?? f.label}</label>
                          {h && (
                            <button type="button" aria-label="O que é isso?" onClick={() => setOpenHelp(open ? null : f.key)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-ink text-[14px] font-bold">?</button>
                          )}
                        </div>
                        {open && h && (
                          <p className="mb-2 rounded-lg bg-tag p-3 text-[15px]">💡 {h.help}</p>
                        )}
                        {f.kind === "input" ? (
                          <input id={f.key} className="field-input text-[16px]" placeholder={h?.ph ?? f.placeholder} value={draft[f.key] ?? ""}
                            onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
                        ) : (
                          <textarea id={f.key} className="field-input min-h-32 text-[16px]" placeholder={h?.ph} value={draft[f.key] ?? ""}
                            onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>

        <div className="mt-20 flex flex-col items-center gap-5 border-t border-border pt-12">
          <p className="text-center text-[17px]">Terminou? Clique no botão preto 👇</p>
          <button className="btn-ink w-full px-8 py-4 text-[16px] sm:w-auto" onClick={() => generatePdf(draft)}>
            <Download className="h-5 w-5" /> Baixar minha Pregação em PDF - Premium
          </button>
          <button className="text-[15px] underline underline-offset-4 text-muted-foreground hover:text-foreground" onClick={() => generatePdf(null)}>
            Baixar Template Oficial em Branco (PDF)
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
