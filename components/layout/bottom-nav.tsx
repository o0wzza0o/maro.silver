"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingBag, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getCategories } from "@/data/categories";
import type { Category } from "@/types";

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/products", label: "التصنيفات", icon: LayoutGrid },
  { href: "/favorites", label: "المفضلة", icon: Heart },
  { href: "/cart", label: "السلة", icon: ShoppingBag },
];

export function BottomNav() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden"
      aria-label="التنقل السفلي"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const badgeCount =
            item.href === "/cart"
              ? totalItems
              : item.href === "/favorites"
                ? wishlistItems.length
                : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition-colors",
                active
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span>{item.label}</span>
              {badgeCount > 0 && (
                <span className="absolute top-0 left-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}

        <Drawer>
          <DrawerTrigger asChild>
            <button
              className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors"
              aria-label="المزيد"
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>المزيد</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>المزيد</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-1 p-4 pb-8">
              {categories.map((category) => (
                <DrawerClose key={category.id} asChild>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    {category.name}
                  </Link>
                </DrawerClose>
              ))}
              <DrawerClose asChild>
                <Link
                  href="/search"
                  className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  البحث
                </Link>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
