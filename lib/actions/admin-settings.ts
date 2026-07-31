"use server"

export async function updateAdminCredentials(username: string, password?: string) {
  // Security Overhaul: Writing to .env dynamically is a critical security vulnerability.
  // We no longer support changing credentials from the web interface for security reasons.
  // Please update the ADMIN_PASSWORD_HASH in the .env file manually.
  return { 
    success: false, 
    error: "لأسباب أمنية، لا يمكن تغيير بيانات الدخول من لوحة التحكم. يرجى تعديل ملف .env مباشرة."
  };
}
