import { createClient } from "@supabase/supabase-js";

// Placeholder fallbacks let `next dev` boot before env is configured;
// real values come from .env.local (see .env.local.example).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
);
