"use client";

import { cn } from "@/lib/utils";

interface SubCategoryChipsProps {
  subCategories: { id: string; name: string; slug: string }[];
  activeSubCategory?: string;
  onSubCategoryChange: (subCategoryId: string | undefined) => void;
}

export function SubCategoryChips({
  subCategories,
  activeSubCategory,
  onSubCategoryChange,
}: SubCategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
      {subCategories.map((sub) => {
        const isAll = sub.slug === "all";
        const isActive = isAll
          ? !activeSubCategory
          : activeSubCategory === sub.id;

        return (
          <button
            key={sub.id}
            onClick={() =>
              onSubCategoryChange(isAll ? undefined : sub.id)
            }
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-secondary"
            )}
          >
            {sub.name}
          </button>
        );
      })}
    </div>
  );
}
