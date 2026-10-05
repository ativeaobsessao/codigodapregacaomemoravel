import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { db } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Código da Pregação Memorável" },
      { name: "description", content: "Acesse sua biblioteca de esboços com seu e-mail da compra." },
      { property: "og:title", content: "Entrar — Código da Pregação Memorável" },
      { property: "og:description", content: "Acesse sua biblioteca de esboços." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

async function registrarConsentimento() {
  const { data } = await db().auth.getUser();
  if (data.user) await db().from("profiles").update({ lgpd_consent_at: new Date().toISOString() }).eq("id", data.user.id);
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [aceito, setAceito] = useState(false);
  const [busy, setBusy] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!aceito) return toast.error("Marque que você concorda com a Política de Privacidade e os Termos.");
    setBusy(true);
    const { error } = await db().auth.signInWithPassword({ email: email.trim(), password: senha });
    if (error) { setBusy(false); return toast.error("E-mail ou senha incorretos."); }
    await registrarConsentimento();
    setBusy(false);
    navigate({ to: "/" });
  }

  async function magicLink() {
    if (!aceito) return toast.error("Marque que você concorda com a Política de Privacidade e os Termos.");
    if (!email.trim()) return toast.error("Digite seu e-mail.");
    setBusy(true);
    localStorage.setItem("lgpd_consent_pending", "1");
    const { error } = await db().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin, shouldCreateUser: false },
    });
    setBusy(false);
    if (error) return toast.error("Não encontramos uma compra com esse e-mail.");
    toast.success("✅ Enviamos um link de acesso para seu e-mail.");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <form onSubmit={entrar} className="mx-auto flex max-w-sm flex-col gap-4 px-6 py-24">
        <h1 className="text-center font-serif text-3xl">Acessar Plataforma</h1>
        <p className="text-center text-[14px] text-muted-foreground">Use o e-mail da sua compra.</p>
        <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail" className="field-input h-12" />
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" className="field-input h-12" />
        <label className="flex items-start gap-3 text-[13px]">
          <input type="checkbox" checked={aceito} onChange={(e) => setAceito(e.target.checked)} className="mt-1" />
          <span>
            Li e concordo com <Link to="/privacidade" className="underline">Política de Privacidade</Link> e{" "}
            <Link to="/termos" className="underline">Termos de Uso</Link>
          </span>
        </label>
        <button disabled={busy || !senha} className="btn-ink h-12">Entrar</button>
        <button type="button" onClick={magicLink} disabled={busy} className="btn-line h-12">Receber link de acesso por e-mail</button>
        <p className="text-[12px] text-muted-foreground">
          Seus dados (e-mail e foto) são usados apenas para liberar acesso conforme seu plano. Você pode solicitar exclusão em Minha Conta.
        </p>
      </form>
      <SiteFooter />
    </div>
  );
}
