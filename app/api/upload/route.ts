import { NextResponse } from "next/server";
import { requireAdmin, serverSupabase } from "@/lib/supabase";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 8 * 1024 * 1024;

async function ensureCatalogImageBucket() {
  const storage = serverSupabase().storage;
  const { data: bucket } = await storage.getBucket("catalog-images");
  if (bucket) return;
  const { error } = await storage.createBucket("catalog-images", {
    public: true,
    fileSizeLimit: maxBytes,
    allowedMimeTypes: Array.from(acceptedTypes),
  });
  if (error && !/already exists/i.test(error.message)) throw error;
}

export async function POST(request: Request) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image first." }, { status: 400 });
    if (!acceptedTypes.has(file.type)) return NextResponse.json({ error: "Use a JPG, PNG, or WEBP image." }, { status: 400 });
    if (file.size > maxBytes) return NextResponse.json({ error: "Image must be 8 MB or smaller." }, { status: 400 });

    await ensureCatalogImageBucket();
    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `motorcycles/${crypto.randomUUID()}.${extension}`;
    const { error } = await serverSupabase().storage.from("catalog-images").upload(path, await file.arrayBuffer(), { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (error) throw error;
    const { data } = serverSupabase().storage.from("catalog-images").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to upload image" }, { status: 400 });
  }
}
