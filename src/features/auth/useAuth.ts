import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { db } from "@/lib/supabase";

export interface Profile {
  id: string;
  email: string | null;
  plano: "basico" | "premium";
  role: "admin" | "cliente";
  avatar_url: string | null;
  lgpd_consent_at: string | null;
  status: string;
}

export async function fetchProfile(id: string): Promise<Profile | null> {
  const { data } = await db().from("profiles").select("*").eq("id", id).maybeSingle();
  return (data as Profile) ?? null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async (u: User | null) => {
      setUser(u);
      const p = u ? await fetchProfile(u.id) : null;
      if (!alive) return;
      setProfile(p);
      setLoading(false);
    };
    db().auth.getSession().then(({ data }) => load(data.session?.user ?? null));
    const { data: sub } = db().auth.onAuthStateChange((ev, s) => {
      if (ev === "SIGNED_IN" && s && localStorage.getItem("lgpd_consent_pending")) {
        localStorage.removeItem("lgpd_consent_pending");
        db().from("profiles").update({ lgpd_consent_at: new Date().toISOString() }).eq("id", s.user.id).then(() => {});
      }
      if (ev === "SIGNED_IN" || ev === "SIGNED_OUT" || ev === "USER_UPDATED") load(s?.user ?? null);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const reload = async () => { if (user) setProfile(await fetchProfile(user.id)); };
  return { user, profile, loading, isAdmin: profile?.role === "admin", reload };
}
