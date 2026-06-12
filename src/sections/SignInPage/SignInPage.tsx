"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthDivider } from "@/components/common/AuthDivider";
import { GoogleAuthButton } from "@/components/common/GoogleAuthButton";
import { Typography } from "@/components/common/Typography";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { SavedShowcase } from "@/components/auth/SavedShowcase";
import { SignInForm } from "@/components/forms/SignInForm";
import { Separator } from "@/components/ui/separator";
import { signInContent } from "@/data/auth";
import { supabase } from "@/lib/supabase";

export const SignInPage = () => {
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleError(null);
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setGoogleError(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      showcase={<SavedShowcase />}
      form={
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-1.5">
            <Typography variant="h2" className="text-2xl font-bold sm:text-3xl">
              {signInContent.title}
            </Typography>
            <Typography variant="lead">{signInContent.subtitle}</Typography>
          </header>

          <div className="flex flex-col gap-2">
            <GoogleAuthButton
              label={signInContent.googleCta}
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            />
            {googleError && (
              <Typography variant="error" role="alert">
                {googleError}
              </Typography>
            )}
          </div>

          <AuthDivider label={signInContent.divider} />

          <SignInForm />

          <Separator />

          <Typography variant="small" className="text-center">
            {signInContent.signUpPrompt}{" "}
            <Link
              href="/signup"
              className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {signInContent.signUpCta}
            </Link>
          </Typography>
        </div>
      }
    />
  );
};
