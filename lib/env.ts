function requiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  // Server-only variables
  get ADMIN_USERNAME() { return requiredEnv("ADMIN_USERNAME", process.env.ADMIN_USERNAME); },
  get ADMIN_PASSWORD() { return requiredEnv("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD); },
  get ADMIN_SESSION_SECRET() { return requiredEnv("ADMIN_SESSION_SECRET", process.env.ADMIN_SESSION_SECRET); },
  get SUPABASE_SERVICE_ROLE_KEY() { return requiredEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY); },
  get NODE_ENV() { return process.env.NODE_ENV || "development"; },

  // Public variables
  get NEXT_PUBLIC_SUPABASE_URL() { return requiredEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL); },
  get NEXT_PUBLIC_SUPABASE_ANON_KEY() { return requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); },
};
