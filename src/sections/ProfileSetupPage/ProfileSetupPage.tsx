import { SquareCheck } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { IconBlock } from "@/components/auth/IconBlock";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { ProfileSetupForm } from "@/components/forms/ProfileSetupForm";
import { profileSetupContent } from "@/data/onboarding";

export const ProfileSetupPage = () => {
  return (
    <OnboardingShell step="final">
      <IconBlock tone="success">
        <SquareCheck className="size-6" />
      </IconBlock>

      <header className="flex flex-col gap-1.5 text-center">
        <Typography variant="h2">{profileSetupContent.title}</Typography>
        <Typography variant="lead">{profileSetupContent.subtitle}</Typography>
      </header>

      <ProfileSetupForm />
    </OnboardingShell>
  );
};
