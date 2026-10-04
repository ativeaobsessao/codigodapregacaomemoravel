import type { ReactNode } from "react";
import type { Plano } from "./types";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-tag px-3 py-0.5 text-[12px] text-muted-foreground">{children}</span>
  );
}

export function PlanoBadge({ plano }: { plano: Plano | null }) {
  if (!plano) return null;
  const premium = plano === "premium";
  return (
    <span
      className={`eyebrow shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] ${
        premium ? "border-ink bg-ink text-paper" : "border-border text-muted-foreground"
      }`}
    >
      {premium ? "Premium" : "Básico"}
    </span>
  );
}
