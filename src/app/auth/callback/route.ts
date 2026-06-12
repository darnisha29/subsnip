import { NextResponse } from "next/server";

import { resolvePostAuthPath } from "@/lib/auth-redirect";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Single landing point for Google OAuth, email confirmations, and password
// reset links. Exchanges the PKCE code, then routes by onboarding state
// unless the link carries an explicit ?next= destination.
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/signin`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/signin`);
  }

  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const destination = await resolvePostAuthPath(supabase, data.user.id);
  return NextResponse.redirect(`${origin}${destination}`);
};
