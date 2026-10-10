"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { browserSupabase } from "@/lib/supabase";

export function Login() {
  const router = useRouter(); const params = useSearchParams(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  async function submit(event: FormEvent) { event.preventDefault(); if (!configured) return; setLoading(true); setError(""); const { error: signInError } = await browserSupabase().auth.signInWithPassword({ email, password }); if (signInError) { setError(signInError.message); setLoading(false); return; } router.replace(params.get("next") || "/admin"); }
  if (!configured) return <main className="login-page"><section><p className="eyebrow">DreambikePH</p><h1>Admin access</h1><p>Add your Supabase settings in <code>.env.local</code> to enable local login.</p><Link href="/">Back to homepage</Link></section></main>;
  return <main className="login-page"><form onSubmit={submit}><p className="eyebrow">DreambikePH</p><h1>Admin access</h1><label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button disabled={loading}>{loading ? "Logging in..." : "Login"}</button><Link href="/">Back to homepage</Link></form></main>;
}
