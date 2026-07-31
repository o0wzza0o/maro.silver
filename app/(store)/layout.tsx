import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { getAppSetting } from "@/lib/supabase-data";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsappLink = await getAppSetting<string>("whatsapp_link", "");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <WhatsAppButton link={whatsappLink} />
    </div>
  );
}
