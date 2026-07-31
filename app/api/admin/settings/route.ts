import { NextResponse } from "next/server";
import { getAppSetting } from "@/lib/supabase-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const value = await getAppSetting<string[]>(key, []);
  return NextResponse.json({ value });
}
