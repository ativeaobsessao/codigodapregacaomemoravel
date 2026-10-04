import { useState } from "react";

const PASSWORD = "1234";

export function AdminGate({ onSuccess }: { onSuccess: () => void }) {
  const [v, setV] = useState("");
  const [err, setErr] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (v === PASSWORD) onSuccess();
        else setErr(true);
      }}
      className="mx-auto flex max-w-sm flex-col gap-4 px-6 py-32 text-center"
    >
      <h1 className="font-serif text-3xl">Acesso Admin</h1>
      <input type="password" autoFocus value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} placeholder="Senha" className="field-input h-12 text-center" />
      {err && <p className="text-[13px] text-destructive">Senha incorreta.</p>}
      <button className="btn-ink h-12">Entrar</button>
    </form>
  );
}
