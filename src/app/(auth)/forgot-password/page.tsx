import type { Metadata } from "next";

import { ForgotPasswordPage } from "@/sections/ForgotPasswordPage/ForgotPasswordPage";

export const metadata: Metadata = {
  title: "Reset your password · Subsnip",
  description: "Get a password reset link by email.",
};

const ForgotPassword = () => {
  return <ForgotPasswordPage />;
};

export default ForgotPassword;
