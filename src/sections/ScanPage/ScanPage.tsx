"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Typography } from "@/components/common/Typography";
import { IconBlock } from "@/components/auth/IconBlock";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { Progress } from "@/components/ui/progress";
import { scanContent } from "@/data/onboarding";
import { formatINR } from "@/utils/formatCurrency";

const TICK_MS = 80;
const EMAILS_PER_TICK = 47;
const DONE_REDIRECT_MS = 1200;

// Simulated scan: the counter and findings animate while the real backend
// scan endpoint is pending; swap the interval for live progress events later.
export const ScanPage = () => {
  const router = useRouter();
  const [processed, setProcessed] = useState(0);

  const total = scanContent.totalEmails;
  const isDone = processed >= total;
  const progressPercent = (processed / total) * 100;
  const secondsRemaining = Math.ceil(
    ((total - processed) / EMAILS_PER_TICK) * (TICK_MS / 1000),
  );
  const visibleCount = Math.min(
    scanContent.subscriptions.length,
    Math.floor((processed / total) * (scanContent.subscriptions.length + 1.5)),
  );
  const visibleSubscriptions = scanContent.subscriptions.slice(0, visibleCount);
  const runningMonthly = visibleSubscriptions.reduce(
    (sum, subscription) => sum + subscription.monthly,
    0,
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setProcessed((previous) => {
        const next = Math.min(previous + EMAILS_PER_TICK, total);
        if (next >= total) {
          window.clearInterval(id);
        }
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [total]);

  useEffect(() => {
    if (!isDone) {
      return;
    }
    const id = window.setTimeout(
      () => router.push("/spend-reveal"),
      DONE_REDIRECT_MS,
    );
    return () => window.clearTimeout(id);
  }, [isDone, router]);

  return (
    <OnboardingShell step={scanContent.step}>
      <IconBlock>
        <LoaderCircle className="size-6 animate-spin" />
      </IconBlock>

      <header className="flex flex-col gap-1.5 text-center">
        <Typography variant="h2">{scanContent.title}</Typography>
        <Typography variant="lead">{scanContent.subtitle}</Typography>
      </header>

      <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {scanContent.processingLabel}
          </Typography>
          <Typography
            as="span"
            variant="small"
            className="font-semibold whitespace-nowrap text-foreground tabular-nums"
          >
            {processed.toLocaleString("en-IN")} /{" "}
            {total.toLocaleString("en-IN")}
          </Typography>
        </div>
        <Progress
          value={progressPercent}
          aria-label={scanContent.processingLabel}
        />
        <Typography variant="small" className="text-center">
          {isDone
            ? "Done!"
            : `~${secondsRemaining} seconds ${scanContent.remainingSuffix}`}
        </Typography>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {scanContent.foundLabel}
          </Typography>
          <Typography
            as="span"
            variant="small"
            aria-live="polite"
            className="font-medium whitespace-nowrap text-primary"
          >
            {visibleCount} {scanContent.subscriptionsLabel} ·{" "}
            {formatINR(runningMonthly)}
            {scanContent.foundMetaSuffix}
          </Typography>
        </div>

        <ul className="flex flex-col gap-2">
          {visibleSubscriptions.map((subscription, index) => {
            const isNewest =
              !isDone && index === visibleSubscriptions.length - 1;
            return (
              <li
                key={subscription.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 duration-500 animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center gap-2.5">
                  <Typography
                    as="span"
                    variant="caption"
                    aria-hidden="true"
                    className="flex size-6 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground"
                  >
                    {subscription.name.charAt(0)}
                  </Typography>
                  <Typography as="span" variant="body" className="font-medium">
                    {subscription.name}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  {isNewest && (
                    <Typography
                      as="span"
                      variant="caption"
                      className="rounded-full bg-success-tint px-2 py-0.5 text-[10px] font-semibold tracking-wide text-success uppercase"
                    >
                      {scanContent.newBadge}
                    </Typography>
                  )}
                  <Typography
                    as="span"
                    variant="small"
                    className="font-medium whitespace-nowrap text-foreground"
                  >
                    {formatINR(subscription.monthly)}
                  </Typography>
                </div>
              </li>
            );
          })}
        </ul>

        {!isDone && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3.5 py-2.5">
            <span aria-hidden="true" className="flex items-center gap-1">
              <span className="size-1 animate-pulse rounded-full bg-primary" />
              <span className="size-1 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
              <span className="size-1 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
            </span>
            <Typography
              as="span"
              variant="small"
              className="font-medium text-primary"
            >
              {scanContent.lookingLabel}
            </Typography>
          </div>
        )}
      </div>
    </OnboardingShell>
  );
};
