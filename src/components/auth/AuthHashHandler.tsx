"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { resolvePostAuthPath } from "@/lib/auth-redirect";

// Supabase's default email templates redirect with session tokens in the URL
// hash (#access_token=...), which never reaches the server. This catches that
// landing anywhere in the app, stores the session, and continues the flow.
export const AuthHashHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) {
      return;
    }

    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const linkType = params.get("type");
    if (!accessToken || !refreshToken) {
      return;
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(async ({ data, error }) => {
        if (error || !data.user) {
          return;
        }
        window.history.replaceState(null, "", window.location.pathname);
        if (linkType === "recovery") {
          router.replace("/reset-password");
          return;
        }
        const destination = await resolvePostAuthPath(supabase, data.user.id);
        router.replace(destination);
      });
  }, [router]);

  return null;
};
