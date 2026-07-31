import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export function getAdminClient() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  return createClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ProductInput {
  name: string;
  slug: string;
  price: number;
  original_price?: number | null;
  images: string[];
  category_id?: string | null;
  sub_category_id?: string | null;
  description?: string | null;
  specifications?: Record<string, string>;
  sizes?: string[];
  in_stock: boolean;
  stock_count: number;
  is_new: boolean;
  is_best_seller: boolean;
}

export async function createProduct(input: ProductInput) {
  const { error } = await getAdminClient().from("products").insert(input);
  if (error) throw error;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const { error } = await getAdminClient()
    .from("products")
    .update(input)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const { error } = await getAdminClient()
    .from("products")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface CategoryInput {
  name: string;
  slug: string;
  image: string;
}

export async function createCategory(input: CategoryInput) {
  const { error } = await getAdminClient().from("categories").insert(input);
  if (error) throw error;
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
) {
  const { error } = await getAdminClient()
    .from("categories")
    .update(input)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await getAdminClient()
    .from("categories")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ─── Banners ──────────────────────────────────────────────────────────────────

export interface BannerInput {
  title: string;
  subtitle: string;
  image: string;
  cta_text: string;
  cta_link: string;
}

export async function createBanner(input: BannerInput) {
  const { error } = await getAdminClient().from("banners").insert(input);
  if (error) throw error;
}

export async function updateBanner(id: string, input: Partial<BannerInput>) {
  const { error } = await getAdminClient()
    .from("banners")
    .update(input)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteBanner(id: string) {
  const { error } = await getAdminClient()
    .from("banners")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function updateBannersOrder(orderedIds: string[]) {
  const client = getAdminClient();
  const updates = orderedIds.map((id, index) =>
    client.from("banners").update({ order_index: index }).eq("id", id)
  );
  await Promise.all(updates);
}

// ─── Governorates ─────────────────────────────────────────────────────────────

export interface GovernorateInput {
  name: string;
  cities: string[];
}

export async function createGovernorate(input: GovernorateInput) {
  const { error } = await getAdminClient().from("governorates").insert(input);
  if (error) throw error;
}

export async function updateGovernorate(
  id: string,
  input: Partial<GovernorateInput>
) {
  const { error } = await getAdminClient()
    .from("governorates")
    .update(input)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteGovernorate(id: string) {
  const { error } = await getAdminClient()
    .from("governorates")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrders() {
  const { data, error } = await getAdminClient()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await getAdminClient()
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// ─── App Settings ─────────────────────────────────────────────────────────────

export async function saveAppSetting(key: string, value: unknown) {
  const { error } = await getAdminClient()
    .from('app_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}
