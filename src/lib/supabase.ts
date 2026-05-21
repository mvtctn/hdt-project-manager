import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qujvfsghzdmrulgpgrzh.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your_supabase_anon_key_placeholder";

// Check if keys are properly configured
const isConfigured = supabaseAnonKey !== "your_supabase_anon_key_placeholder";

if (!isConfigured && typeof window !== "undefined") {
  console.warn(
    "⚠️ Supabase is not fully configured. Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
  );
}

// Khởi tạo Supabase Client toàn cục
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export { isConfigured };
