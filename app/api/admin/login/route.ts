import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { createSession } from "@/lib/session";
import crypto from "crypto";

const ADMIN_SESSION_COOKIE = "admin_session";

// In-memory rate limiting and account lockout
const rateLimitMap = new Map<string, { attempts: number; lockoutUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  
  // Rate limiting check
  const rateLimit = rateLimitMap.get(ip) || { attempts: 0, lockoutUntil: 0 };
  if (rateLimit.lockoutUntil > Date.now()) {
    const remaining = Math.ceil((rateLimit.lockoutUntil - Date.now()) / 60000);
    return NextResponse.json(
      { error: `تم حظر الحساب مؤقتاً. يرجى المحاولة بعد ${remaining} دقيقة.` },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { username, password } = body;

  const validUsername = env.ADMIN_USERNAME.replace(/"/g, ''); // strip quotes just in case
  const validPassword = env.ADMIN_PASSWORD.replace(/"/g, '');

  // Simple username and password check
  const isUsernameValid = (username === validUsername);
  const isPasswordValid = (password === validPassword);

  if (!isUsernameValid || !isPasswordValid) {
    // Record failed attempt
    rateLimit.attempts += 1;
    if (rateLimit.attempts >= MAX_ATTEMPTS) {
      rateLimit.lockoutUntil = Date.now() + LOCKOUT_MINUTES * 60000;
      rateLimit.attempts = 0;
    }
    rateLimitMap.set(ip, rateLimit);

    return NextResponse.json(
      { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  }

  // Reset rate limit on success
  rateLimitMap.delete(ip);

  // Create session
  const userAgent = request.headers.get("user-agent") || undefined;
  const { token, expiresAt } = await createSession(ip, userAgent);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: expiresAt,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
