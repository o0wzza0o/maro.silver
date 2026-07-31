import { getAdminClient } from "@/lib/supabase-admin";

export async function hashTokenEdge(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateSessionToken(): string {
  return crypto.randomUUID() + "-" + crypto.randomUUID(); // Fallback secure token since Web Crypto might not have randomBytes
}

export async function createSession(ipAddress?: string, userAgent?: string) {
  const token = generateSessionToken();
  const tokenHash = await hashTokenEdge(token);
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error } = await getAdminClient().from("admin_sessions").insert({
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
    last_used_at: new Date().toISOString(),
    ip_address: ipAddress || null,
    user_agent: userAgent || null,
  });

  if (error) throw error;
  
  return { token, expiresAt };
}

export async function validateSession(token: string) {
  const tokenHash = await hashTokenEdge(token);
  
  const { data, error } = await getAdminClient()
    .from("admin_sessions")
    .select("*")
    .eq("token_hash", tokenHash)
    .single();

  if (error || !data) return null;

  if (new Date(data.expires_at) < new Date()) {
    // expired
    return null;
  }
  
  return data;
}

export async function deleteSession(token: string) {
  const tokenHash = await hashTokenEdge(token);
  await getAdminClient().from("admin_sessions").delete().eq("token_hash", tokenHash);
}
