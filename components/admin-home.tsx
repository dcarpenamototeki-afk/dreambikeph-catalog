"use client";

import Link from "next/link";
import { Images, LayoutPanelTop } from "lucide-react";
import { useEffect, useState } from "react";
import { browserSupabase } from "@/lib/supabase";

export function AdminHome() {
  const [ready, setReady] = useState(false);
  useEffect(() => { browserSupabase().auth.getSession().then(({ data }) => { if (!data.session) { location.href = "/login?next=%2Fadmin"; return; } setReady(true); }); }, []);
  if (!ready) return <main className="admin-page"><p className="admin-loading">Checking login...</p></main>;
  return <main className="admin-page"><header><h1>DreambikePH admin</h1><div><Link href="/catalog">View catalog</Link><button onClick={() => browserSupabase().auth.signOut().then(() => location.href = "/login")}>Log out</button></div></header><section className="admin-home"><p className="admin-kicker">Choose what you want to manage</p><h2>Admin access</h2><div className="admin-choice-grid"><Link href="/admin/catalog"><LayoutPanelTop /><span>Catalog</span><small>Add, edit, reserve, or remove motorcycles.</small><b>Open catalog manager →</b></Link><Link href="/admin/banners"><Images /><span>Web ad banner</span><small>Upload up to five 5:2 banners for the public catalog.</small><b>Open banner manager →</b></Link></div></section></main>;
}
