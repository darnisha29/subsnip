import Link from "next/link";

import { Typography } from "@/components/common/Typography";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { forgotPasswordContent } from "@/data/auth";

export const ForgotPasswordPage = () => {
  return (
    <AuthCardShell>
      <header className="flex flex-col gap-1.5">
        <Typography variant="h2">{forgotPasswordContent.title}</Typography>
        <Typography variant="lead">{forgotPasswordContent.subtitle}</Typography>
      </header>

      <ForgotPasswordForm />

      <Typography variant="small" className="text-center">
        <Link
          href="/signin"
          className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {forgotPasswordContent.backCta}
        </Link>
      </Typography>
    </AuthCardShell>
  );
};
