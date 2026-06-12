import { Typography } from "@/components/common/Typography";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { resetPasswordContent } from "@/data/auth";

export const ResetPasswordPage = () => {
  return (
    <AuthCardShell>
      <header className="flex flex-col gap-1.5">
        <Typography variant="h2">{resetPasswordContent.title}</Typography>
        <Typography variant="lead">{resetPasswordContent.subtitle}</Typography>
      </header>

      <ResetPasswordForm />
    </AuthCardShell>
  );
};
