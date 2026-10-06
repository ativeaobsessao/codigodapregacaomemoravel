import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Gateway-agnóstico: tudo vira { email, plano } e cai em liberarAcesso().
type Plano = "basico" | "premium";
const PRECO_PLANO: Record<number, Plano> = { 1990: "basico", 2490: "premium", 2990: "premium" };

function centavos(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) return null;
  return Number.isInteger(n) && n >= 1000 ? n : Math.round(n * 100);
}

function extrair(body: Record<string, any>): { email: string; plano: Plano } | null {
  if (typeof body["email"] === "string" && (body["plano"] === "basico" || body["plano"] === "premium"))
    return { email: body["email"], plano: body["plano"] };
  const email = body["customer_email"] ?? body["Customer"]?.email ?? body["customer"]?.email;
  const valor = centavos(body["amount"] ?? body["Commissions"]?.product_base_price ?? body["Commissions"]?.charge_amount);
  const plano = valor != null ? PRECO_PLANO[valor] : undefined;
  if (typeof email !== "string" || !plano) return null;
  return { email, plano };
}

function assinaturaOk(raw: string, url: URL, token: string) {
  if (url.searchParams.get("token") === token) return true;
  const sig = url.searchParams.get("signature") ?? "";
  const esperado = createHmac("sha1", token).update(raw).digest("hex");
  return sig.length === esperado.length && timingSafeEqual(Buffer.from(sig), Buffer.from(esperado));
}

export async function liberarAcesso(email: string, plano: Plano) {
  const url = process.env["SUPABASE_URL"] ?? "https://npmnewspddzqqahngapk.supabase.co";
  const admin = createClient(url, process.env["CPM_SERVICE_ROLE_KEY"]!, { auth: { persistSession: false, autoRefreshToken: false } });
  const mail = email.trim().toLowerCase();

  let { data: perfil } = await admin.from("profiles").select("id, plano").eq("email", mail).maybeSingle();
  if (!perfil) {
    const { data, error } = await admin.auth.admin.createUser({ email: mail, email_confirm: true });
    if (error) throw error;
    await admin.from("profiles").upsert({ id: data.user.id, email: mail });
    perfil = { id: data.user.id, plano: "basico" };
  }
  const final: Plano = perfil.plano === "premium" ? "premium" : plano; // nunca rebaixa
  const { error } = await admin.from("profiles")
    .update({ plano: final, role: "cliente", status: "ativo" }).eq("id", perfil.id).neq("role", "admin");
  if (error) throw error;
  return { id: perfil.id, plano: final };
}

export const Route = createFileRoute("/api/public/webhook-kiwify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const token = process.env["KIWIFY_TOKEN"];
        if (!token || !process.env["CPM_SERVICE_ROLE_KEY"]) {
          console.error("[webhook-kiwify] faltam KIWIFY_TOKEN ou CPM_SERVICE_ROLE_KEY");
          return new Response("not configured", { status: 500 });
        }
        if (!assinaturaOk(raw, new URL(request.url), token)) {
          console.warn("[webhook-kiwify] assinatura inválida");
          return new Response("invalid signature", { status: 401 });
        }
        let body: Record<string, any>;
        try { body = z.record(z.any()).parse(JSON.parse(raw)); } catch { return new Response("bad json", { status: 400 }); }
        console.log("[webhook-kiwify] recebido", JSON.stringify(body).slice(0, 2000));
        const status = body["order_status"];
        if (status && status !== "paid" && status !== "approved") {
          console.log("[webhook-kiwify] ignorado status", status);
          return Response.json({ ok: true, ignorado: status });
        }
        const venda = extrair(body);
        if (!venda) {
          console.warn("[webhook-kiwify] não identifiquei email/plano");
          return Response.json({ ok: true, aviso: "email/plano não identificados" });
        }
        try {
          const r = await liberarAcesso(venda.email, venda.plano);
          console.log("[webhook-kiwify] acesso liberado", venda.email, r.plano);
          return Response.json({ ok: true, plano: r.plano });
        } catch (e) {
          console.error("[webhook-kiwify] erro", e);
          return new Response("erro", { status: 500 });
        }
      },
    },
  },
});
