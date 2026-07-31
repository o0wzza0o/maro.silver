import { Banner } from "@/types";
import { getBanners as fetchBanners } from "@/lib/supabase-data";

// Cache for client-side
let bannersCache: Banner[] | null = null;

export async function getBanners(): Promise<Banner[]> {
  if (bannersCache) return bannersCache;
  bannersCache = await fetchBanners();
  return bannersCache;
}

export function clearBannersCache() {
  bannersCache = null;
}
