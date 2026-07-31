import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/session";

const ADMIN_SESSION_COOKIE = "admin_session";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  
  if (sessionToken) {
    try {
      await deleteSession(sessionToken);
    } catch (e) {
      // Ignore errors on logout
    }
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
