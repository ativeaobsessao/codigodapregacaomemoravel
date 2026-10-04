import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { AdminGate } from "@/features/admin/AdminGate";
import { AdminDashboard } from "@/features/admin/AdminDashboard";

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
  const [ok, setOk] = useState(false);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      {ok ? <AdminDashboard /> : <AdminGate onSuccess={() => setOk(true)} />}
    </div>
  );
}
