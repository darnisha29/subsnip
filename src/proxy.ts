import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/account",
  "/connect-gmail",
  "/scan",
  "/spend-reveal",
  "/link-telegram",
  "/profile-setup",
  "/reset-password",
];

const GUEST_ONLY_PATHS = ["/signin", "/signup"];

// Refreshes the Supabase session cookie on every matched request and
// enforces auth: protected routes need a session, guest-only routes bounce
// signed-in users to /account. Session presence only — no DB calls here.
export const proxy = async (request: NextRequest) => {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isGuestOnly = GUEST_ONLY_PATHS.some((path) => pathname === path);

  if (!user && isProtected) {
    const redirectUrl = new URL("/signin", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isGuestOnly) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return response;
};

export const config = {
  matcher: [
    "/account/:path*",
    "/connect-gmail",
    "/scan",
    "/spend-reveal",
    "/link-telegram",
    "/profile-setup",
    "/reset-password",
    "/signin",
    "/signup",
  ],
};
