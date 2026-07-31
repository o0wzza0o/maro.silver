import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSession } from "@/lib/session";

const ADMIN_SESSION_COOKIE = "admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin and /api/admin routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Allow login/logout routes through
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  // Check for valid session cookie
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
  if (!sessionCookie || !sessionCookie.value) {
    return handleUnauthorized(request);
  }

  // Verify session in database
  const session = await validateSession(sessionCookie.value);
  if (!session) {
    return handleUnauthorized(request);
  }

  return NextResponse.next();
}

function handleUnauthorized(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
