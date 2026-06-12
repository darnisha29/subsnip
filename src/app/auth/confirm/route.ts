import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { resolvePostAuthPath } from "@/lib/auth-redirect";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Server-side email link verification (token_hash flow). Requires the
// Supabase email templates to link to
// {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/signin`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/signin`);
  }

  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/reset-password`);
  }
  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const destination = await resolvePostAuthPath(supabase, data.user.id);
  return NextResponse.redirect(`${origin}${destination}`);
};
