import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="مسار التنقل"
      className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}
    >
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only">الرئيسية</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
