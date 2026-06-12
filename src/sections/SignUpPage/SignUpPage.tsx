"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthDivider } from "@/components/common/AuthDivider";
import { GoogleAuthButton } from "@/components/common/GoogleAuthButton";
import { Typography } from "@/components/common/Typography";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { Separator } from "@/components/ui/separator";
import { signUpContent } from "@/data/auth";
import { supabase } from "@/lib/supabase";

import { SignUpShowcase } from "./SignUpShowcase";

export const SignUpPage = () => {
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setGoogleError(null);
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setGoogleError(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      showcase={<SignUpShowcase />}
      form={
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-1.5">
            <Typography variant="h2" className="text-2xl font-bold sm:text-3xl">
              {signUpContent.title}
            </Typography>
            <Typography variant="small" className="leading-6">
              {signUpContent.subtitle}
            </Typography>
          </header>

          <div className="flex flex-col gap-2">
            <GoogleAuthButton
              label={signUpContent.googleCta}
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
            />
            {googleError && (
              <Typography variant="error" role="alert">
                {googleError}
              </Typography>
            )}
          </div>

          <AuthDivider label={signUpContent.divider} />

          <SignUpForm />

          <Typography variant="caption" className="leading-5">
            {signUpContent.terms.prefix}{" "}
            <Link
              href={signUpContent.terms.termsHref}
              className="font-medium text-primary hover:underline"
            >
              {signUpContent.terms.termsLabel}
            </Link>{" "}
            {signUpContent.terms.conjunction}{" "}
            <Link
              href={signUpContent.terms.privacyHref}
              className="font-medium text-primary hover:underline"
            >
              {signUpContent.terms.privacyLabel}
            </Link>
            .
          </Typography>

          <Separator />

          <Typography variant="small" className="text-center">
            {signUpContent.signInPrompt}{" "}
            <Link
              href="/signin"
              className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {signUpContent.signInCta}
            </Link>
          </Typography>
        </div>
      }
    />
  );
};
