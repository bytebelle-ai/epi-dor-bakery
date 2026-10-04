import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "./supabase";

export function AdminGuard({ navigate, children }: { navigate: (p: string) => void; children: ReactNode }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { if (active) navigate("/admin/login"); return; }
      const { data: row } = await supabase.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
      if (!row) { await supabase.auth.signOut(); if (active) navigate("/admin/login"); return; }
      if (active) setOk(true);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && active) navigate("/admin/login");
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  if (!ok) return <main style={{ padding: 40 }}>Checking access...</main>;
  return <>{children}</>;
}