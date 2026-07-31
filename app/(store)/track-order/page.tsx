import { TrackOrderClient } from "@/components/tracking/track-order-client";
import { PageTransition } from "@/components/layout/animations";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata = {
  title: "تتبع الطلب | MARO SILVER",
  description: "تتبع حالة طلبك وموعد التوصيل",
};

export default function TrackOrderPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Breadcrumb 
          items={[
            { label: "تتبع الطلب" }
          ]}
          className="mb-8"
        />
        
        <TrackOrderClient />
      </div>
    </PageTransition>
  );
}
