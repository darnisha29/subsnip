import { NextResponse } from "next/server";

import { decryptToken, encryptToken } from "@/lib/gmail/crypto";
import { refreshGmailToken } from "@/lib/gmail/google-oauth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const EXPIRY_BUFFER_MS = 5 * 60 * 1000;

// Hands the signed-in user their OWN short-lived Gmail access token for
// on-device scanning. Refresh tokens never leave this server.
export const GET = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: row } = await supabase
    .from("gmail_tokens")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!row) {
    return NextResponse.json({ connected: false }, { status: 404 });
  }
  if (row.revoked_at) {
    return NextResponse.json(
      { connected: false, error: "revoked" },
      { status: 401 },
    );
  }

  const expiresAt = new Date(row.access_token_expires_at).getTime();
  let accessToken = decryptToken(row.access_token_encrypted);
  let expiresAtIso = row.access_token_expires_at;

  if (expiresAt - Date.now() < EXPIRY_BUFFER_MS) {
    const refreshed = await refreshGmailToken(
      decryptToken(row.refresh_token_encrypted),
    );
    if (refreshed.error || !refreshed.access_token) {
      // invalid_grant means the user revoked access at Google's side.
      await supabase
        .from("gmail_tokens")
        .update({ revoked_at: new Date().toISOString() })
        .eq("user_id", user.id);
      return NextResponse.json(
        { connected: false, error: "revoked" },
        { status: 401 },
      );
    }
    accessToken = refreshed.access_token;
    expiresAtIso = new Date(
      Date.now() + refreshed.expires_in * 1000,
    ).toISOString();
    await supabase
      .from("gmail_tokens")
      .update({
        access_token_encrypted: encryptToken(refreshed.access_token),
        access_token_expires_at: expiresAtIso,
        last_used_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  }

  return NextResponse.json({
    connected: true,
    accessToken,
    gmailEmail: row.gmail_email,
    expiresAt: expiresAtIso,
  });
};
