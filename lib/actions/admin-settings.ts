"use server"

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function updateAdminCredentials(username: string, password?: string) {
  const envPath = path.join(process.cwd(), ".env");
  
  try {
    let envContent = "";
    try {
      envContent = await fs.readFile(envPath, "utf-8");
    } catch (e) {
      // file might not exist, start empty
    }

    const lines = envContent.split("\n");
    let usernameFound = false;
    let passwordFound = false;

    const newLines = lines.map(line => {
      if (line.trim().startsWith("ADMIN_USERNAME=")) {
        usernameFound = true;
        return `ADMIN_USERNAME="${username}"`;
      }
      if (password && line.trim().startsWith("ADMIN_PASSWORD=")) {
        passwordFound = true;
        return `ADMIN_PASSWORD="${password}"`;
      }
      return line;
    });

    if (!usernameFound) {
      newLines.push(`ADMIN_USERNAME="${username}"`);
    }
    if (password && !passwordFound) {
      newLines.push(`ADMIN_PASSWORD="${password}"`);
    }

    await fs.writeFile(envPath, newLines.join("\n"));
    
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
