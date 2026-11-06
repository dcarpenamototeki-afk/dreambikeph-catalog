import { NextResponse } from "next/server";
import { requireAdmin, serverSupabase } from "@/lib/supabase";

const errorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : typeof error === "object" && error && "message" in error ? String(error.message) : fallback;

export async function GET(request: Request) {
  try {
    const admin = new URL(request.url).searchParams.get("scope") === "admin";
    if (admin && !await requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let query = serverSupabase().from("web_banners").select("*").order("sort_order").order("created_at");
    if (!admin) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) { return NextResponse.json({ error: errorMessage(error, "Unable to load web banners") }, { status: 500 }); }
}

export async function POST(request: Request) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { image_url } = await request.json();
    if (typeof image_url !== "string" || !image_url) return NextResponse.json({ error: "Upload a banner image first." }, { status: 400 });
    const { count, error: countError } = await serverSupabase().from("web_banners").select("id", { count: "exact", head: true });
    if (countError) throw countError;
    if ((count ?? 0) >= 5) return NextResponse.json({ error: "You can keep up to five web banners. Delete one before uploading another." }, { status: 400 });
    const { data, error } = await serverSupabase().from("web_banners").insert({ image_url, is_active: true, sort_order: count ?? 0 }).select().single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: errorMessage(error, "Unable to save web banner") }, { status: 400 }); }
}
