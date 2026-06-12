import type { Metadata } from "next";

import { SignInPage } from "@/sections/SignInPage/SignInPage";

export const metadata: Metadata = {
  title: "Sign in · Subsnip",
  description: "Sign in to track your subscriptions.",
};

const SignIn = () => {
  return <SignInPage />;
};

export default SignIn;
