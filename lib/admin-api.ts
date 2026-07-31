/**
 * Client-side helper that calls the server-side /api/admin/db route.
 * All mutations go through the server which uses the service role key.
 */

type Table = "products" | "categories" | "banners" | "governorates" | "orders";
type Action = "create" | "update" | "delete" | "reorder";

async function dbMutate(
  table: Table,
  action: Action,
  data?: Record<string, unknown>,
  id?: string,
  orderedIds?: string[]
): Promise<void> {
  const res = await fetch("/api/admin/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, action, data, id, orderedIds }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `HTTP ${res.status}`);
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const adminCreateProduct = (data: Record<string, unknown>) =>
  dbMutate("products", "create", data);

export const adminUpdateProduct = (id: string, data: Record<string, unknown>) =>
  dbMutate("products", "update", data, id);

export const adminDeleteProduct = (id: string) =>
  dbMutate("products", "delete", undefined, id);

// ─── Categories ───────────────────────────────────────────────────────────────
export const adminCreateCategory = (data: Record<string, unknown>) =>
  dbMutate("categories", "create", data);

export const adminUpdateCategory = (id: string, data: Record<string, unknown>) =>
  dbMutate("categories", "update", data, id);

export const adminDeleteCategory = (id: string) =>
  dbMutate("categories", "delete", undefined, id);

// ─── Banners ──────────────────────────────────────────────────────────────────
export const adminCreateBanner = (data: Record<string, unknown>) =>
  dbMutate("banners", "create", data);

export const adminUpdateBanner = (id: string, data: Record<string, unknown>) =>
  dbMutate("banners", "update", data, id);

export const adminDeleteBanner = (id: string) =>
  dbMutate("banners", "delete", undefined, id);

export const adminReorderBanners = (orderedIds: string[]) =>
  dbMutate("banners", "reorder", undefined, undefined, orderedIds);

// ─── Governorates ─────────────────────────────────────────────────────────────
export const adminCreateGovernorate = (data: Record<string, unknown>) =>
  dbMutate("governorates", "create", data);

export const adminUpdateGovernorate = (
  id: string,
  data: Record<string, unknown>
) => dbMutate("governorates", "update", data, id);

export const adminDeleteGovernorate = (id: string) =>
  dbMutate("governorates", "delete", undefined, id);

// ─── Orders ───────────────────────────────────────────────────────────────────
export const adminUpdateOrderStatus = (id: string, status: string) =>
  dbMutate("orders", "update", { status }, id);
