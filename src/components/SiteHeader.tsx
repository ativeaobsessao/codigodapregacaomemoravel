import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-[14px] font-bold uppercase tracking-[0.08em]">Código da Pregação Memorável</Link>
        <Link to="/admin" className="btn-line">Acesso Admin</Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-[13px] text-muted-foreground sm:flex-row sm:justify-between">
        <span className="font-serif text-lg text-foreground">Código da Pregação Memorável</span>
        <span>
          Código da Pregação Memorável • Siga no Instagram{" "}
          <a href="https://instagram.com/codigodapregacaomemoravel" target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-4">@codigodapregacaomemoravel</a>
        </span>
      </div>
    </footer>
  );
}
