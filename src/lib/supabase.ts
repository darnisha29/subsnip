import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Cookie-backed browser client so the proxy and route handlers can read the
// same session that client components create.
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
