import { useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AccountButton() {
  const { user, profile, loading, isAdmin, reload } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <span className="btn-line opacity-0">Acessar Plataforma</span>;
  if (!user) return <Link to="/login" className="btn-line">Acessar Plataforma</Link>;
  if (isAdmin) return <Link to="/admin" className="btn-line">Acesso Admin</Link>;

  async function savePw(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return toast.error("A senha precisa ter pelo menos 6 caracteres.");
    if (pw !== pw2) return toast.error("As duas senhas não são iguais.");
    setBusy(true);
    const { error } = await db().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("✅ Senha alterada!");
    setPw(""); setPw2(""); setPwOpen(false);
  }

  async function upload(f: File) {
    const path = `${user!.id}/avatar-${Date.now()}.${f.name.split(".").pop() || "jpg"}`;
    const { error } = await db().storage.from("avatars").upload(path, f, { upsert: true });
    if (error) return toast.error(error.message);
    const url = db().storage.from("avatars").getPublicUrl(path).data.publicUrl;
    const { error: e2 } = await db().from("profiles").update({ avatar_url: url }).eq("id", user!.id);
    if (e2) return toast.error(e2.message);
    await reload();
    toast.success("✅ Foto atualizada!");
  }

  async function pedirExclusao() {
    if (!confirm("Quer mesmo pedir a exclusão dos seus dados? Seu acesso será encerrado.")) return;
    const { error } = await db().from("profiles").update({ status: "solicitou_exclusao" }).eq("id", user!.id);
    if (error) return toast.error(error.message);
    toast.success("Pedido de exclusão registrado.");
    await reload();
  }

  async function sair() {
    await qc.cancelQueries();
    qc.clear();
    await db().auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="btn-line gap-2">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px]">
              {(user.email ?? "?").charAt(0).toUpperCase()}
            </span>
          )}
          Minha Conta
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-2 py-1.5 text-[12px] text-muted-foreground">
            {user.email} • Plano {profile?.plano === "premium" ? "Premium" : "Básico"}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setPwOpen(true)}>🔑 Redefinir senha</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => fileRef.current?.click()}>🖼️ Inserir/Trocar foto de perfil</DropdownMenuItem>
          <DropdownMenuItem onSelect={sair}>🚪 Sair da conta</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={pedirExclusao} className="text-[12px] text-muted-foreground">
            Solicitar exclusão dos meus dados
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif text-2xl">Redefinir senha</DialogTitle></DialogHeader>
          <form onSubmit={savePw} className="flex flex-col gap-3">
            <input type="password" placeholder="Nova Senha" value={pw} onChange={(e) => setPw(e.target.value)} className="field-input h-12" />
            <input type="password" placeholder="Confirmar Nova Senha" value={pw2} onChange={(e) => setPw2(e.target.value)} className="field-input h-12" />
            <button disabled={busy} className="btn-ink h-12">{busy ? "Salvando…" : "Salvar"}</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
