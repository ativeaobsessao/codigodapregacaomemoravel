import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Instagram, Download } from "lucide-react";
import { STEPS, STORAGE_KEY, IG_HANDLE, IG_URL, type Draft } from "@/features/template/fields";
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
        <div className="mx-auto flex max-w-[800px] items-center justify-between gap-4 px-6 py-5">
          <Link to="/" className="btn-line"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
          <a href={IG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] font-medium hover:text-gold">
            <Instagram className="h-4 w-4" /> {IG_HANDLE}
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-6 py-12">
        <span className="eyebrow inline-block rounded-full border border-gold px-3 py-1 text-[11px] text-gold">
          {savedAt ? `Salvo automaticamente • ${savedAt}` : "Salvamento automático ativo"}
        </span>
        <h1 className="mt-6 font-serif text-[36px] leading-tight">Template para uma pregação memorável</h1>
        <p className="mt-3 text-muted-foreground">Preencha os 12 passos. Tudo fica salvo neste navegador enquanto você escreve.</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="btn-line" onClick={() => { save(draft); toast.success("Salvo"); }}>Salvar Agora</button>
          <button className="btn-line" onClick={restore}>Restaurar Rascunho</button>
          <button className="btn-line" onClick={clear}>Limpar Tudo</button>
        </div>

        <div className="mt-12 space-y-10">
          {STEPS.map((s) => (
            <section key={s.n} className="border-t border-border pt-8">
              <h2 className="mb-4 text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{s.n} {s.title}</h2>
              <div className="space-y-4">
                {s.fields.map((f) => (
                  <label key={f.key} className="block">
                    {s.fields.length > 1 && <span className="eyebrow mb-1 block text-muted-foreground">{f.label}</span>}
                    {f.kind === "input" ? (
                      <input className="field-input" placeholder={f.placeholder} value={draft[f.key] ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
                    ) : (
                      <textarea className="field-input min-h-28" value={draft[f.key] ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-border pt-10">
          <button className="btn-ink w-full sm:w-auto" onClick={() => generatePdf(draft)}>
            <Download className="h-4 w-4" /> Baixar minha Pregação em PDF - Premium
          </button>
          <button className="text-[14px] underline underline-offset-4 text-muted-foreground hover:text-foreground" onClick={() => generatePdf(null)}>
            Baixar Template Oficial em Branco (PDF)
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
