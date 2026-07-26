import { ProductGridSkeleton } from "@/components/layout/skeletons";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-secondary" />
      <div className="mb-2 h-8 w-64 animate-pulse rounded bg-secondary" />
      <div className="mb-8 h-4 w-24 animate-pulse rounded bg-secondary" />
      <ProductGridSkeleton />
    </div>
  );
}
