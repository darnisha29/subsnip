import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { buildGmailAuthUrl } from "@/lib/gmail/google-oauth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const STATE_COOKIE = "gmail_oauth_state";

export const GET = async (request: Request) => {
  const { origin } = new URL(request.url);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/signin`);
  }

  const state = randomBytes(24).toString("base64url");
  const response = NextResponse.redirect(buildGmailAuthUrl(state, origin));
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https"),
    maxAge: 600,
    path: "/api/gmail/oauth",
  });
  return response;
};
