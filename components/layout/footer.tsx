import Link from "next/link";
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              MARO SILVER
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              متجر متخصص في المجوهرات الفضية الفاخرة. نقدم تشكيلة واسعة من
              الخواتم والسلاسل والأساور والأقراط بجودة عالية وتصاميم عصرية.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-secondary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-secondary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="transition-colors hover:text-foreground">
                  جميع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/products?category=men" className="transition-colors hover:text-foreground">
                  رجالي
                </Link>
              </li>
              <li>
                <Link href="/products?category=women" className="transition-colors hover:text-foreground">
                  نسائي
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="transition-colors hover:text-foreground">
                  المفضلة
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-semibold">التصنيفات</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products?category=rings" className="transition-colors hover:text-foreground">
                  خواتم
                </Link>
              </li>
              <li>
                <Link href="/products?category=chains" className="transition-colors hover:text-foreground">
                  سلاسل
                </Link>
              </li>
              <li>
                <Link href="/products?category=bracelets" className="transition-colors hover:text-foreground">
                  أساور
                </Link>
              </li>
              <li>
                <Link href="/products?category=earrings" className="transition-colors hover:text-foreground">
                  أقراط
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span dir="ltr">+964 770 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@marosilver.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>بغداد، العراق</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MARO SILVER. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
