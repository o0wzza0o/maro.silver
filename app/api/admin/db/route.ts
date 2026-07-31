import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  createBanner,
  updateBanner,
  deleteBanner,
  createGovernorate,
  updateGovernorate,
  deleteGovernorate,
  updateBannersOrder,
  updateOrderStatus,
} from "@/lib/supabase-admin";

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "maro-silver-secret-session-key-2025";

async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === SESSION_SECRET;
}

export async function POST(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { table, action, data, id, orderedIds } = body as {
    table: string;
    action: "create" | "update" | "delete" | "reorder";
    data?: Record<string, unknown>;
    id?: string;
    orderedIds?: string[];
  };

  try {
    switch (table) {
      // ── products ──────────────────────────────────────────
      case "products":
        if (action === "create") await createProduct(data as any);
        else if (action === "update" && id) await updateProduct(id, data as any);
        else if (action === "delete" && id) await deleteProduct(id);
        else return NextResponse.json({ error: "Invalid action/id" }, { status: 400 });
        break;

      // ── categories ────────────────────────────────────────
      case "categories":
        if (action === "create") await createCategory(data as any);
        else if (action === "update" && id) await updateCategory(id, data as any);
        else if (action === "delete" && id) await deleteCategory(id);
        else return NextResponse.json({ error: "Invalid action/id" }, { status: 400 });
        break;

      // ── banners ───────────────────────────────────────────
      case "banners":
        if (action === "create") await createBanner(data as any);
        else if (action === "update" && id) await updateBanner(id, data as any);
        else if (action === "delete" && id) await deleteBanner(id);
        else if (action === "reorder" && orderedIds) await updateBannersOrder(orderedIds);
        else return NextResponse.json({ error: "Invalid action/id" }, { status: 400 });
        break;

      // ── governorates ──────────────────────────────────────
      case "governorates":
        if (action === "create") await createGovernorate(data as any);
        else if (action === "update" && id) await updateGovernorate(id, data as any);
        else if (action === "delete" && id) await deleteGovernorate(id);
        else return NextResponse.json({ error: "Invalid action/id" }, { status: 400 });
        break;

      // ── orders ──────────────────────────────────────────────
      case "orders":
        if (action === "update" && id && data?.status) {
          await updateOrderStatus(id, data.status as string);
        } else {
          return NextResponse.json({ error: "Invalid action/id" }, { status: 400 });
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    // Revalidate the entire application layout so all pages fetch fresh data
    revalidatePath("/", "layout");
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[admin/db]", err);
    return NextResponse.json(
      { error: err?.message || "Database error" },
      { status: 500 }
    );
  }
}
