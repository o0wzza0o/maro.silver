"use server"

import { revalidatePath } from "next/cache";
import { saveAppSetting } from "@/lib/supabase-admin";

export async function updateAdminCredentials(username: string, password?: string) {
  try {
    // Update username
    await saveAppSetting('admin_username', username);

    // Update password if provided
    if (password) {
      await saveAppSetting('admin_password', password);
    }
    
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
