/**
 * Category display order stored in localStorage.
 * Key: "maro_home_cats" => array of category IDs (max 6)
 * Key: "maro_nav_cats"  => array of category IDs (max 8)
 */

export const HOME_ORDER_KEY = "maro_home_cats";
export const NAV_ORDER_KEY  = "maro_nav_cats";

export function getCategoryOrder(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function setCategoryOrder(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("maro_cat_order_changed", { detail: { key } }));
}

/**
 * Sorts or filters a categories array by a stored order list.
 * Categories not in the list are appended at the end (fallback).
 */
export function applyOrder(allCats: { id: string }[], orderedIds: string[]) {
  if (orderedIds.length === 0) return allCats;
  const inOrder = orderedIds
    .map(id => allCats.find(c => c.id === id))
    .filter(Boolean) as typeof allCats;
  return inOrder;
}
