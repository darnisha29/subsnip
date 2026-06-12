import { ShieldCheck, Square } from "lucide-react";
import Link from "next/link";

import { NavButton } from "@/components/common/NavButton";
import { Typography } from "@/components/common/Typography";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { IconBlock } from "@/components/auth/IconBlock";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { Card, CardContent } from "@/components/ui/card";
import { connectGmailContent } from "@/data/onboarding";

export const ConnectGmailPage = () => {
  return (
    <OnboardingShell step={connectGmailContent.step}>
      <IconBlock>
        <ShieldCheck className="size-6" />
      </IconBlock>

      <header className="flex flex-col gap-1.5 text-center">
        <Typography variant="h2">{connectGmailContent.title}</Typography>
        <Typography variant="lead">{connectGmailContent.subtitle}</Typography>
      </header>

      <Card className="gap-0 py-0 ring-border">
        <CardContent className="flex flex-col p-0">
          {connectGmailContent.trustSignals.map((signal, index) => (
            <div
              key={signal.title}
              className={
                index > 0
                  ? "flex items-start gap-3 border-t border-border px-4 py-3.5"
                  : "flex items-start gap-3 px-4 py-3.5"
              }
            >
              <Square
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <div className="flex flex-col gap-0.5">
                <Typography variant="h4">{signal.title}</Typography>
                <Typography variant="small">{signal.description}</Typography>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {/* Routes straight to the simulated scan until Gmail OAuth lands. */}
        <NavButton
          href="/scan"
          className="h-12 w-full rounded-full text-sm font-semibold"
        >
          <GoogleIcon className="size-4.5" />
          {connectGmailContent.cta}
        </NavButton>
        <Link
          href="/profile-setup"
          className="self-center rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {connectGmailContent.skip}
        </Link>
      </div>
    </OnboardingShell>
  );
};
