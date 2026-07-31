import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول — MARO SILVER",
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
