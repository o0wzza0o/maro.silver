"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition, ScaleIn } from "@/components/layout/animations";
import { Suspense } from "react";
import { useToast } from "@/hooks/use-toast";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { toast } = useToast();

  const handleCopy = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      toast({
        title: "تم نسخ رقم الطلب",
        variant: "success",
      });
    }
  };

  return (
    <ScaleIn className="flex flex-col items-center text-center max-w-md mx-auto">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-3">
        تم تأكيد طلبك بنجاح!
      </h1>

      <p className="text-muted-foreground mb-4">
        شكراً لك على طلبك من MARO SILVER
      </p>

      {orderNumber && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 w-full mb-6">
          <p className="text-sm text-gray-500 mb-2">رقم الطلب الخاص بك</p>
          <div className="flex items-center justify-center gap-3">
            <code className="text-xl font-bold text-gray-900 font-mono tracking-wider">{orderNumber}</code>
            <button 
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-900 transition-colors"
              title="نسخ رقم الطلب"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            احتفظ بهذا الرقم لتتمكن من تتبع حالة طلبك من خلال صفحة "تتبع الطلب".
          </p>
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-8">
        سيتم التواصل معك قريباً لتأكيد الطلب وتحديد موعد التوصيل.
      </p>

      <div className="flex gap-4 w-full justify-center">
        <Button asChild size="lg" className="flex-1 max-w-[200px]">
          <Link href="/products">متابعة التسوق</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="flex-1 max-w-[200px]">
          <Link href="/track-order">تتبع الطلب</Link>
        </Button>
      </div>
    </ScaleIn>
  );
}

export default function OrderSuccessPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Suspense fallback={<div className="h-64 flex items-center justify-center">جاري التحميل...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </PageTransition>
  );
}
