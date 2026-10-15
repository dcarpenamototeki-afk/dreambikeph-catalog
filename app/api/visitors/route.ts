import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

async function visitorCount() {
  const { count, error } = await serverSupabase().from("catalog_visits").select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function GET() {
  try { return NextResponse.json({ count: await visitorCount() }); }
  catch { return NextResponse.json({ count: null }); }
}

export async function POST() {
  try {
    const { error } = await serverSupabase().from("catalog_visits").insert({});
    if (error) throw error;
    return NextResponse.json({ count: await visitorCount() }, { status: 201 });
  } catch { return NextResponse.json({ count: null }); }
}
