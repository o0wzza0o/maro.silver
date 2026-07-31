import { Governorate } from "@/types";
import { getGovernorates as fetchGovernorates, getGovernorateById as fetchGovernorateById } from "@/lib/supabase-data";

// Cache for client-side
let governoratesCache: Governorate[] | null = null;

export async function getGovernorates(): Promise<Governorate[]> {
  if (governoratesCache) return governoratesCache;
  governoratesCache = await fetchGovernorates();
  return governoratesCache;
}

export async function getGovernorateById(id: string): Promise<Governorate | undefined> {
  return await fetchGovernorateById(id) || undefined;
}
