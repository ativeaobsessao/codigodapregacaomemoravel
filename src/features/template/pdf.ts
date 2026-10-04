import { STEPS, IG_HANDLE, SITE_URL, type Draft } from "./fields";

const INK: [number, number, number] = [18, 18, 18];
const MUTED: [number, number, number] = [107, 107, 107];
const GOLD: [number, number, number] = [196, 164, 132];

export async function generatePdf(draft: Draft | null) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  const maxW = W - M * 2;
  let y = M;

  const newPage = () => { doc.addPage(); y = M; };
  const ensure = (h: number) => { if (y + h > H - 70) newPage(); };

  // Header
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...GOLD);
  doc.text("CÓDIGO DA PREGAÇÃO MEMORÁVEL - TEMPLATE OFICIAL", M, y);
  y += 36;
  doc.setFont("times", "normal").setFontSize(32).setTextColor(...INK);
  const title = draft ? (draft['tema']?.trim() || "Minha Pregação") : "Template em Branco";
  for (const l of doc.splitTextToSize(title, maxW)) { doc.text(l, M, y); y += 36; }
  doc.setDrawColor(234, 230, 225).line(M, y, W - M, y);
  y += 28;

  for (const step of STEPS) {
    ensure(60);
    doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(...MUTED);
    doc.text(`${step.n} ${step.title.toUpperCase()}`, M, y);
    y += 22;
    for (const f of step.fields) {
      if (step.fields.length > 1) {
        ensure(30);
        doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...MUTED);
        doc.text(f.label.toUpperCase(), M, y);
        y += 16;
      }
      if (draft) {
        const v = draft[f.key]?.trim() || "—";
        doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(...INK);
        for (const l of doc.splitTextToSize(v, maxW)) { ensure(20); doc.text(l, M, y); y += 20; }
        y += 6;
      } else {
        const lines = f.kind === "textarea" ? 4 : 1;
        doc.setDrawColor(200, 195, 190);
        for (let i = 0; i < lines; i++) { ensure(26); y += 22; doc.line(M, y, W - M, y); }
        y += 14;
      }
    }
    y += 14;
  }

  // Closing page
  newPage();
  doc.setFont("times", "normal").setFontSize(24).setTextColor(...INK);
  const closing = doc.splitTextToSize("Gerado pelo Template Oficial - Código da Pregação Memorável", maxW);
  let cy = H / 2 - 30;
  for (const l of closing) { doc.text(l, W / 2, cy, { align: "center" }); cy += 30; }
  doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(...GOLD);
  doc.text(`Siga ${IG_HANDLE}`, W / 2, cy + 10, { align: "center" });

  // Watermark + footer on every page
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
    doc.setFont("helvetica", "bold").setFontSize(40).setTextColor(...INK);
    { const tw = doc.getTextWidth(IG_HANDLE) * 0.7071; doc.text(IG_HANDLE, (W - tw) / 2, (H + tw) / 2, { angle: 45 } as any); }
    doc.restoreGraphicsState();
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...MUTED);
    doc.text(`CÓDIGO DA PREGAÇÃO MEMORÁVEL • ${IG_HANDLE} • ${SITE_URL}`, W / 2, H - 30, { align: "center" });
  }

  doc.save(draft ? "minha-pregacao.pdf" : "template-oficial-em-branco.pdf");
}
