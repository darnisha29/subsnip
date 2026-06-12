import { AppLogo } from "@/components/common/AppLogo";
import { Typography } from "@/components/common/Typography";
import { ShowcasePanel } from "@/components/auth/ShowcasePanel";
import { TelegramAlertCard } from "@/components/auth/TelegramAlertCard";
import { TrustBadges } from "@/components/auth/TrustBadges";
import { Separator } from "@/components/ui/separator";
import { signUpShowcase } from "@/data/auth";

export const AuthShowcase = () => {
  return (
    <div className="flex flex-col gap-6 duration-700 animate-in fade-in slide-in-from-bottom-4">
      <AppLogo className="mb-2 lg:mb-6" />

      <header className="flex flex-col gap-3">
        <Typography
          variant="h1"
          className="max-w-md text-3xl font-bold text-balance sm:text-4xl lg:leading-[1.12]"
        >
          {signUpShowcase.headline}
        </Typography>
        <Typography variant="lead" className="max-w-lg sm:text-lg sm:leading-8">
          {signUpShowcase.subheadline}
        </Typography>
      </header>

      <ShowcasePanel />

      <TelegramAlertCard />

      <Separator />

      <TrustBadges />
    </div>
  );
};
