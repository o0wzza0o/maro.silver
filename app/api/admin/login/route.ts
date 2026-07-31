import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAppSetting } from "@/lib/supabase-data";

const ADMIN_SESSION_COOKIE = "admin_session";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  const validUsername = await getAppSetting<string | undefined>("admin_username", process.env.ADMIN_USERNAME);
  const validPassword = await getAppSetting<string | undefined>("admin_password", process.env.ADMIN_PASSWORD);
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "maro-silver-secret-session-key-2025";

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json(
      { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return NextResponse.json({ success: true });
}
