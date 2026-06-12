import { SquareCheck } from "lucide-react";

import { AppLogo } from "@/components/common/AppLogo";
import { CountUp } from "@/components/common/CountUp";
import { Typography } from "@/components/common/Typography";
import { Card, CardContent } from "@/components/ui/card";
import { signInShowcase } from "@/data/auth";

// Sign-in showcase: leads with money already saved instead of money wasted —
// returning users respond to progress, not shock.
export const SavedShowcase = () => {
  return (
    <div className="flex flex-col gap-6 duration-700 animate-in fade-in slide-in-from-bottom-4">
      <AppLogo className="mb-2 lg:mb-6" />

      <header className="flex flex-col gap-3">
        <Typography
          variant="h1"
          className="max-w-md text-3xl font-bold text-balance sm:text-4xl lg:leading-[1.12]"
        >
          {signInShowcase.headlineLines.map((line) => (
            <Typography key={line} variant="inherit" className="block">
              {line}
            </Typography>
          ))}
        </Typography>
        <Typography variant="lead" className="max-w-lg sm:text-lg sm:leading-8">
          {signInShowcase.subheadline}
        </Typography>
      </header>

      <Card className="gap-0 py-0 shadow-[0_16px_50px_rgba(83,74,183,0.1)] ring-border">
        <CardContent className="flex flex-col gap-2.5 p-5 sm:p-6">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider text-pill-foreground uppercase"
          >
            {signInShowcase.savedLabel}
          </Typography>
          <CountUp
            value={signInShowcase.savedAmount}
            prefix="₹"
            className="text-4xl font-bold tracking-tight text-primary tabular-nums sm:text-5xl"
          />
          <div className="flex items-center gap-2">
            <SquareCheck
              aria-hidden="true"
              className="size-4 shrink-0 text-success"
            />
            <Typography as="span" variant="small">
              {signInShowcase.savedMeta}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
