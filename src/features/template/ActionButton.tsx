import type { ReactNode } from "react";

type V = "ink" | "whats" | "line";
const cls: Record<V, string> = {
  ink: "bg-ink text-background border-ink",
  whats: "bg-whatsapp text-white border-whatsapp",
  line: "bg-card text-foreground border-ink",
};

export function ActionButton({ v, onClick, children, sub }: { v: V; onClick: () => void; children: ReactNode; sub: string }) {
  return (
    <div>
      <button onClick={onClick}
        className={`flex min-h-16 w-full items-center justify-center rounded-lg border-2 px-5 py-4 text-center text-[16px] font-bold leading-snug ${cls[v]}`}>
        {children}
      </button>
      <p className="mt-2 text-center text-[13px] text-muted-foreground">{sub}</p>
    </div>
  );
}
