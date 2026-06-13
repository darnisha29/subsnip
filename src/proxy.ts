import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/account",
  "/profile-setup",
  "/reset-password",
];

const GUEST_ONLY_PATHS = ["/signin", "/signup"];

// Onboarding routes parked for now (Gmail/scan/telegram). Their feature code
// lives under src/sections + src/lib/gmail; here we just bounce visitors to
// the dashboard until they're re-enabled.
const DISABLED_PATHS = [
  "/connect-gmail",
  "/scan",
  "/spend-reveal",
  "/link-telegram",
];

// Refreshes the Supabase session cookie on every matched request and
// enforces auth: protected routes need a session, guest-only routes bounce
// signed-in users to /dashboard. Session presence only — no DB calls here.
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

  if (DISABLED_PATHS.some((path) => pathname === path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isGuestOnly = GUEST_ONLY_PATHS.some((path) => pathname === path);

  if (!user && isProtected) {
    const redirectUrl = new URL("/signin", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isGuestOnly) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
};

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/profile-setup",
    "/reset-password",
    "/signin",
    "/signup",
    "/connect-gmail",
    "/scan",
    "/spend-reveal",
    "/link-telegram",
  ],
};
