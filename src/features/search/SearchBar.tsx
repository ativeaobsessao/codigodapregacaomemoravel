import { Search } from "lucide-react";

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="O que você precisa pregar amanhã? Ex: ansiedade, medo do futuro, oração"
        className="h-16 w-full rounded-lg border border-ink bg-card pl-14 pr-5 text-[16px] outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}

export const PILLS = ["Ansiedade", "Medo", "Coragem", "Oração", "Presença", "Mulheres da Bíblia", "Cura", "Família", "Perdão", "Fé", "Perseverança", "Todos"];

export function FilterPills({ active, onSelect }: { active: string | null; onSelect: (p: string | null) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {PILLS.map((p) => {
        const isActive = p === "Todos" ? active === null : active === p;
        return (
          <button
            key={p}
            onClick={() => onSelect(p === "Todos" ? null : p)}
            className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
              isActive ? "border-ink bg-ink text-paper" : "border-border bg-card text-foreground hover:border-ink"
            }`}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
