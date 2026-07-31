import { NextResponse } from "next/server";
import { getAppSetting } from "@/lib/supabase-data";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/session";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  if (!sessionCookie || !sessionCookie.value || !(await validateSession(sessionCookie.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const value = await getAppSetting<string[]>(key, []);
  return NextResponse.json({ value });
}
