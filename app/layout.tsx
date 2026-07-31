import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MARO SILVER | مجوهرات فضية فاخرة",
  description:
    "متجر MARO SILVER للمجوهرات الفضية الفاخرة - خواتم، سلاسل، أساور، وأقراط بجودة عالية",
  keywords: ["فضة", "مجوهرات", "خواتم", "سلاسل", "أساور", "MARO SILVER"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
