"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition, ScaleIn } from "@/components/layout/animations";

export default function OrderSuccessPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <ScaleIn className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            تم تأكيد طلبك بنجاح!
          </h1>

          <p className="text-muted-foreground mb-2">
            شكراً لك على طلبك من MARO SILVER
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            سيتم التواصل معك قريباً لتأكيد الطلب وتحديد موعد التوصيل.
          </p>

          <Button asChild size="lg">
            <Link href="/products">متابعة التسوق</Link>
          </Button>
        </ScaleIn>
      </div>
    </PageTransition>
  );
}
