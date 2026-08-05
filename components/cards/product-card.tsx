"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { HoverLift } from "@/components/layout/animations";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  horizontal?: boolean;
}

export function ProductCard({
  product,
  className,
  horizontal = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    toast({
      title: "تمت الإضافة للسلة",
      description: product.name,
      variant: "success",
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    toast({
      title: inWishlist ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة",
      description: product.name,
      variant: "success",
    });
  };

  if (horizontal) {
    return (
      <HoverLift>
        <Link
          href={`/products/${product.id}`}
          className={cn(
            "group flex min-w-[280px] gap-4 rounded-xl border border-border bg-background p-3 transition-all",
            className
          )}
        >
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-secondary">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="112px"
            />
            {product.isNew && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                جديد
              </Badge>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between py-1">
            <div>
              <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                {product.name}
              </h3>
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">
                  {product.rating}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="mr-2 text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                aria-label="أضف للسلة"
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Link>
      </HoverLift>
    );
  }

  return (
    <HoverLift>
      <Link
        href={`/products/${product.id}`}
        className={cn(
          "group relative flex flex-col rounded-xl border border-border bg-background overflow-hidden",
          className
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.isNew && <Badge variant="secondary">جديد</Badge>}
            {product.isBestSeller && (
              <Badge variant="default">الأكثر مبيعاً</Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive">نفذت الكمية</Badge>
            )}
          </div>

          <button
            onClick={handleToggleWishlist}
            className={cn(
              "absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-all hover:bg-background hover:scale-110",
              inWishlist && "text-red-500"
            )}
            aria-label={inWishlist ? "إزالة من المفضلة" : "أضف للمفضلة"}
          >
            <Heart
              className={cn("h-4 w-4", inWishlist && "fill-current")}
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug mb-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2">
            <div>
              <span className="font-semibold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="mr-2 text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <Button
            className="mt-3 w-full"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingBag className="h-4 w-4" />
            {product.inStock ? "أضف للسلة" : "غير متوفر"}
          </Button>
        </div>
      </Link>
    </HoverLift>
  );
}
