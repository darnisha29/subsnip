import { QrCode, Send } from "lucide-react";
import Link from "next/link";

import { Typography } from "@/components/common/Typography";
import { IconBlock } from "@/components/auth/IconBlock";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { linkTelegramContent } from "@/data/onboarding";

export const LinkTelegramPage = () => {
  return (
    <OnboardingShell step={linkTelegramContent.step}>
      <IconBlock tone="telegram">
        <Send className="size-6" />
      </IconBlock>

      <header className="flex flex-col gap-1.5 text-center">
        <Typography variant="h2">{linkTelegramContent.title}</Typography>
        <Typography variant="lead">{linkTelegramContent.subtitle}</Typography>
      </header>

      <Card className="gap-0 py-0 ring-border">
        <CardContent className="flex flex-col gap-3.5 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-telegram text-white"
              >
                <Send className="size-4.5" />
              </span>
              <div className="flex flex-col">
                <Typography as="span" variant="body" className="font-semibold">
                  {linkTelegramContent.bot.handle}
                </Typography>
                <Typography as="span" variant="small">
                  {linkTelegramContent.bot.description}
                </Typography>
              </div>
            </div>
            <Typography
              as="span"
              variant="caption"
              className="rounded-full bg-success-tint px-2 py-0.5 font-semibold text-success"
            >
              {linkTelegramContent.bot.verifiedBadge}
            </Typography>
          </div>

          <div className="flex flex-col gap-2.5 rounded-lg bg-background px-3.5 py-3">
            <Typography
              as="span"
              variant="caption"
              className="font-semibold tracking-wider text-telegram uppercase"
            >
              {linkTelegramContent.sampleLabel}
            </Typography>
            <Typography variant="body">
              {linkTelegramContent.sampleMessage}
            </Typography>
            <div aria-hidden="true" className="flex flex-wrap gap-2">
              <span className="flex h-8 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">
                {linkTelegramContent.sampleActions[0]}
              </span>
              <span className="flex h-8 items-center rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground">
                {linkTelegramContent.sampleActions[1]}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        asChild
        className="h-12 w-full rounded-full bg-telegram text-sm font-semibold text-white hover:bg-telegram/90"
      >
        <a
          href={linkTelegramContent.bot.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Send aria-hidden="true" className="size-4" />
          {linkTelegramContent.cta}
        </a>
      </Button>

      <div className="flex items-center gap-3.5 rounded-xl border border-dashed border-border px-4 py-3.5">
        <span
          role="img"
          aria-label={`QR code linking to ${linkTelegramContent.bot.handle}`}
          className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-pill text-pill-foreground"
        >
          <QrCode aria-hidden="true" className="size-7" />
        </span>
        <div className="flex flex-col gap-0.5">
          <Typography as="span" variant="body" className="font-semibold">
            {linkTelegramContent.qr.title}
          </Typography>
          <Typography as="span" variant="small">
            {linkTelegramContent.qr.description}
          </Typography>
        </div>
      </div>

      <Link
        href="/profile-setup"
        className="self-center rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {linkTelegramContent.skip}
      </Link>
    </OnboardingShell>
  );
};
