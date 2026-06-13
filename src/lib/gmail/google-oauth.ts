const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  error?: string;
  error_description?: string;
}

const redirectUri = (origin: string): string =>
  `${origin}/api/gmail/oauth/callback`;

export const buildGmailAuthUrl = (state: string, origin: string): string => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: redirectUri(origin),
    response_type: "code",
    scope: GMAIL_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

const requestToken = async (
  body: Record<string, string>,
): Promise<GoogleTokenResponse> => {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      ...body,
    }),
  });
  return (await response.json()) as GoogleTokenResponse;
};

export const exchangeGmailCode = (code: string, origin: string) =>
  requestToken({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri(origin),
  });

export const refreshGmailToken = (refreshToken: string) =>
  requestToken({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

export const fetchGmailAddress = async (
  accessToken: string,
): Promise<string | null> => {
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/profile",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok) {
    return null;
  }
  const profile = (await response.json()) as { emailAddress?: string };
  return profile.emailAddress ?? null;
};
