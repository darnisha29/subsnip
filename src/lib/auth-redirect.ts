import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

// Post-auth landing: onboarded users go to the account page, everyone else
// enters the onboarding wizard.
export const resolvePostAuthPath = async (
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<string> => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", userId)
    .maybeSingle();

  return profile?.onboarding_completed_at ? "/account" : "/connect-gmail";
};
