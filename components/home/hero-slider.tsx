"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { getBanners } from "@/data/banners";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types";

export function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBanners()
      .then(setBanners)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (loading) {
    return (
      <section className="relative aspect-[16/9] md:aspect-[21/7] overflow-hidden rounded-2xl bg-muted animate-pulse" aria-label="البانر الرئيسي">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground">جاري التحميل...</div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="relative" aria-label="البانر الرئيسي">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, direction: "rtl" }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div className="relative aspect-[16/9] md:aspect-[21/7] overflow-hidden rounded-2xl">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 px-6 text-center text-white">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 animate-slide-up">
                    {banner.title}
                  </h2>
                  <p className="text-sm md:text-lg text-white/90 max-w-lg mb-6 animate-slide-up">
                    {banner.subtitle}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 animate-slide-up"
                  >
                    <Link href={banner.ctaLink}>{banner.ctaText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              current === index
                ? "w-6 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            )}
            aria-label={`الانتقال للشريحة ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
