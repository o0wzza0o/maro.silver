import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTransition, ScaleIn } from "@/components/layout/animations";

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <ScaleIn className="flex flex-col items-center text-center">
          <p className="text-8xl font-bold text-muted-foreground/30 mb-4">404</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            الصفحة غير موجودة
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          <Button asChild size="lg">
            <Link href="/">العودة للرئيسية</Link>
          </Button>
        </ScaleIn>
      </div>
    </PageTransition>
  );
}
