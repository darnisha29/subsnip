import type { Metadata } from "next";

import { ResetPasswordPage } from "@/sections/ResetPasswordPage/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Set a new password · Subsnip",
  description: "Choose a new password for your account.",
};

const ResetPassword = () => {
  return <ResetPasswordPage />;
};

export default ResetPassword;
