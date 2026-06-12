import type { Metadata } from "next";

import { SignUpPage } from "@/sections/SignUpPage/SignUpPage";

export const metadata: Metadata = {
  title: "Create your account · Subsnip",
  description:
    "Sign up for Subsnip to stop forgotten subscription charges with renewal alerts.",
};

const SignUp = () => {
  return <SignUpPage />;
};

export default SignUp;
