import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export function browserSupabase() { if (!url || !anonKey) throw new Error("Supabase is not configured."); return createClient(url, anonKey); }
export function serverSupabase() { if (!url || !serviceKey) throw new Error("Server Supabase settings are missing."); return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } }); }
const allowed = (process.env.ALLOWED_USER_UIDS ?? "").split(",").map((value) => value.trim()).filter(Boolean);
export async function requireAdmin(request: Request) { const token = request.headers.get("authorization")?.replace("Bearer ", ""); if (!token) return null; const { data } = await serverSupabase().auth.getUser(token); return data.user && allowed.includes(data.user.id) ? data.user : null; }
