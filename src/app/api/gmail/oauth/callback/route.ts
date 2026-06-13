import { NextResponse, type NextRequest } from "next/server";

import { encryptToken } from "@/lib/gmail/crypto";
import { exchangeGmailCode, fetchGmailAddress } from "@/lib/gmail/google-oauth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const STATE_COOKIE = "gmail_oauth_state";
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

const failure = (origin: string) =>
  NextResponse.redirect(`${origin}/connect-gmail?error=gmail_connect_failed`);

export const GET = async (request: NextRequest) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const stateCookie = request.cookies.get(STATE_COOKIE)?.value;

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return failure(origin);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/signin`);
  }

  const tokens = await exchangeGmailCode(code, origin);
  if (tokens.error || !tokens.access_token || !tokens.refresh_token) {
    return failure(origin);
  }

  const gmailEmail = await fetchGmailAddress(tokens.access_token);
  if (!gmailEmail) {
    return failure(origin);
  }

  const { error } = await supabase.from("gmail_tokens").upsert({
    user_id: user.id,
    access_token_encrypted: encryptToken(tokens.access_token),
    refresh_token_encrypted: encryptToken(tokens.refresh_token),
    gmail_email: gmailEmail,
    scopes: [GMAIL_SCOPE],
    access_token_expires_at: new Date(
      Date.now() + tokens.expires_in * 1000,
    ).toISOString(),
    granted_at: new Date().toISOString(),
    revoked_at: null,
    last_used_at: new Date().toISOString(),
  });
  if (error) {
    return failure(origin);
  }

  const response = NextResponse.redirect(`${origin}/scan`);
  response.cookies.delete(STATE_COOKIE);
  return response;
};
