import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { useAuth } from "@/features/auth/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Central de Escala — Código da Pregação Memorável" },
      { name: "description", content: "Adicione e gerencie esboços em 30 segundos." },
      { property: "og:title", content: "Central de Escala" },
      { property: "og:description", content: "Área administrativa de esboços." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      {loading ? (
        <p className="py-24 text-center text-muted-foreground">Carregando…</p>
      ) : !user || !isAdmin ? (
        <div className="mx-auto max-w-sm px-6 py-32 text-center">
          <h1 className="font-serif text-3xl">Acesso Admin</h1>
          <p className="mt-3 text-muted-foreground">{user ? "Sua conta não tem permissão de admin." : "Entre com sua conta de admin."}</p>
          {!user && <Link to="/login" className="btn-ink mt-6">Acessar Plataforma</Link>}
        </div>
      ) : (
        <>
          <p className="mx-auto mt-8 max-w-5xl rounded-lg border border-border bg-card px-6 py-4 text-[13px] text-muted-foreground">
            Adicionar esboço aqui salva direto no Supabase, não consome crédito Lovable e não precisa rebuild. Fallback: Supabase Dashboard &gt; Table Editor &gt; esbocos &gt; Insert Row
          </p>
          <AdminDashboard />
        </>
      )}
    </div>
  );
}
