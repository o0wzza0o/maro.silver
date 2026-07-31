"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Heart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetailsView({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [sizeError, setSizeError] = useState(false);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      toast({
        title: "برجاء اختيار المقاس أولاً",
        variant: "destructive",
      });
      return;
    }
    
    setSizeError(false);
    addItem(product, quantity, selectedSize);
    toast({
      title: "تمت الإضافة للسلة",
      description: `${product.name} (${quantity})`,
      variant: "success",
    });
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    toast({
      title: inWishlist ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة",
      variant: "success",
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary">
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  selectedImage === index
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                )}
                aria-label={`صورة ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.isNew && <Badge variant="secondary">جديد</Badge>}
            {product.isBestSeller && <Badge>الأكثر مبيعاً</Badge>}
            <Badge variant={product.inStock ? "success" : "destructive"}>
              {product.inStock ? "متوفر" : "نفذت الكمية"}
            </Badge>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-border"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} تقييم)
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        {/* Specifications */}
        <div className="rounded-xl border border-border p-4 space-y-3">
          <h3 className="font-semibold">المواصفات</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">المادة:</span>
              <span className="mr-2 font-medium">
                {product.specifications.material}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">التصنيف:</span>
              <span className="mr-2 font-medium">
                {product.specifications.category}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">الجنس:</span>
              <span className="mr-2 font-medium">
                {product.specifications.gender}
              </span>
            </div>
            {product.specifications.weight && (
              <div>
                <span className="text-muted-foreground">الوزن:</span>
                <span className="mr-2 font-medium">
                  {product.specifications.weight}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              المقاس 
              {sizeError && <span className="text-xs text-red-500 font-normal">(مطلوب)</span>}
            </label>
            <Select 
              value={selectedSize} 
              onValueChange={(val) => {
                setSelectedSize(val);
                setSizeError(false);
              }}
            >
              <SelectTrigger className={cn("w-full max-w-xs", sizeError && "border-red-500 ring-1 ring-red-500")}>
                <SelectValue placeholder="اختر المقاس" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="text-sm font-medium mb-2 block">الكمية</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label="تقليل الكمية"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-lg font-medium">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setQuantity(Math.min(product.stockCount, quantity + 1))
              }
              disabled={quantity >= product.stockCount}
              aria-label="زيادة الكمية"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              ({product.stockCount} متوفر)
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            أضف للسلة
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? "إزالة من المفضلة" : "أضف للمفضلة"}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                inWishlist && "fill-red-500 text-red-500"
              )}
            />
          </Button>
        </div>

        {/* Shipping Info */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="flex flex-col items-center gap-2 text-center">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">توصيل مجاني</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">ضمان الجودة</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <RotateCcw className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">استبدال 7 أيام</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">
              الوصف
            </TabsTrigger>
            <TabsTrigger value="details" className="flex-1">
              التفاصيل
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex-1">
              الشحن
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </TabsContent>
          <TabsContent value="details" className="text-sm space-y-2">
            <p><strong>المادة:</strong> {product.specifications.material}</p>
            <p><strong>التصنيف:</strong> {product.specifications.category}</p>
            <p><strong>الجنس:</strong> {product.specifications.gender}</p>
            {product.specifications.weight && (
              <p><strong>الوزن:</strong> {product.specifications.weight}</p>
            )}
          </TabsContent>
          <TabsContent value="shipping" className="text-sm text-muted-foreground leading-relaxed">
            <p>نوفر التوصيل المجاني لجميع الطلبات داخل العراق.</p>
            <p className="mt-2">مدة التوصيل: 2-5 أيام عمل حسب المحافظة.</p>
            <p className="mt-2">الدفع عند الاستلام متاح لجميع المناطق.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
