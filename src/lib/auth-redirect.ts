import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

// Post-auth landing: onboarded users go straight to the dashboard, everyone
// else finishes profile setup first. (Gmail/scan/telegram onboarding is
// disabled for now — see the redirect stubs under app/(auth).)
export const resolvePostAuthPath = async (
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<string> => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", userId)
    .maybeSingle();

  return profile?.onboarding_completed_at ? "/dashboard" : "/profile-setup";
};
