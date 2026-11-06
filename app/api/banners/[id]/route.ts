import { NextResponse } from "next/server";
import { requireAdmin, serverSupabase } from "@/lib/supabase";

const errorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : typeof error === "object" && error && "message" in error ? String(error.message) : fallback;

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { is_active } = await request.json();
    if (typeof is_active !== "boolean") return NextResponse.json({ error: "Choose active or inactive." }, { status: 400 });
    const { data, error } = await serverSupabase().from("web_banners").update({ is_active }).eq("id", params.id).select().single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) { return NextResponse.json({ error: errorMessage(error, "Unable to update web banner") }, { status: 400 }); }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { error } = await serverSupabase().from("web_banners").delete().eq("id", params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: errorMessage(error, "Unable to delete web banner") }, { status: 400 }); }
}
