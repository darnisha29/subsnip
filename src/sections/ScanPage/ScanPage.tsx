"use client";

import { CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Typography } from "@/components/common/Typography";
import { IconBlock } from "@/components/auth/IconBlock";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { scanContent } from "@/data/onboarding";
import {
  type FoundSubscription,
  nextRenewalDate,
  normalizeKey,
  runGmailScan,
} from "@/lib/gmail/scanner";
import { supabase } from "@/lib/supabase";
import { formatINR } from "@/utils/formatCurrency";

const SCAN_WINDOW_DAYS = 180;
const DONE_REDIRECT_MS = 1200;

type ScanPhase = "preparing" | "scanning" | "done" | "failed";

const isoDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

// On-device scan: the browser reads Gmail metadata directly (never bodies)
// and stores only matched subscription metadata. See src/lib/gmail/scanner.
export const ScanPage = () => {
  const router = useRouter();
  const startedRef = useRef(false);
  const [phase, setPhase] = useState<ScanPhase>("preparing");
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);
  const [found, setFound] = useState<FoundSubscription[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  useEffect(() => {
    router.prefetch("/spend-reveal");
  }, [router]);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    let scanId: string | null = null;

    const markFailed = async () => {
      if (scanId) {
        await supabase
          .from("email_scans")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", scanId);
      }
      setPhase("failed");
    };

    const run = async () => {
      const tokenResponse = await fetch("/api/gmail/token");
      if (!tokenResponse.ok) {
        router.replace("/connect-gmail");
        return;
      }
      const { accessToken } = (await tokenResponse.json()) as {
        accessToken: string;
      };

      const [{ data: userData }, { data: services }, { data: existing }] =
        await Promise.all([
          supabase.auth.getUser(),
          supabase.from("services").select("*").eq("is_active", true),
          supabase.from("subscriptions").select("service_id, manual_name"),
        ]);
      const user = userData.user;
      if (!user || !services) {
        await markFailed();
        return;
      }
      const existingServiceIds = new Set(
        (existing ?? [])
          .map((row) => row.service_id)
          .filter((id): id is string => id !== null),
      );
      const existingManualKeys = new Set(
        (existing ?? [])
          .map((row) => normalizeKey(row.manual_name))
          .filter((key) => key.length > 0),
      );

      const { data: scanRow } = await supabase
        .from("email_scans")
        .insert({
          user_id: user.id,
          status: "running",
          scan_from_date: isoDaysAgo(SCAN_WINDOW_DAYS),
          scan_to_date: isoDaysAgo(0),
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      scanId = scanRow?.id ?? null;

      const startTime = performance.now();
      setPhase("scanning");

      const result = await runGmailScan({
        accessToken,
        services,
        existingServiceIds,
        existingManualKeys,
        onProgress: (nextProcessed, nextTotal, nextFound) => {
          setProcessed(nextProcessed);
          setTotal(nextTotal);
          setFound(nextFound);
          if (nextProcessed > 0 && nextTotal > nextProcessed) {
            const msPerEmail = (performance.now() - startTime) / nextProcessed;
            setSecondsRemaining(
              Math.max(
                1,
                Math.ceil(((nextTotal - nextProcessed) * msPerEmail) / 1000),
              ),
            );
          } else {
            setSecondsRemaining(null);
          }
        },
      });

      if (result.found.length > 0) {
        const { error: insertError } = await supabase
          .from("subscriptions")
          .insert(
            result.found.map((subscription) => ({
              user_id: user.id,
              service_id: subscription.serviceId,
              manual_name: subscription.manualName,
              amount: subscription.amountInr,
              currency: "INR",
              amount_inr: subscription.amountInr,
              billing_cycle: subscription.billingCycle,
              first_charge_date: subscription.firstChargeDate,
              last_charge_date: subscription.lastChargeDate,
              next_renewal_date: nextRenewalDate(
                subscription.lastChargeDate,
                subscription.billingCycle,
              ),
              status: "active" as const,
              detection_source: "gmail" as const,
              confidence_score: subscription.confidence,
            })),
          );
        if (insertError) {
          await markFailed();
          return;
        }
      }

      if (scanId) {
        await supabase
          .from("email_scans")
          .update({
            status: result.errorCount > 0 ? "partial" : "completed",
            emails_total: result.total,
            emails_processed: result.processed,
            subscriptions_found: result.found.length,
            error_count: result.errorCount,
            completed_at: new Date().toISOString(),
          })
          .eq("id", scanId);
      }
      await supabase
        .from("profiles")
        .update({ first_scan_completed_at: new Date().toISOString() })
        .eq("id", user.id);

      setPhase("done");
      window.setTimeout(() => router.push("/spend-reveal"), DONE_REDIRECT_MS);
    };

    run().catch(() => markFailed());
  }, [router]);

  const isDone = phase === "done";
  const progressPercent = total > 0 ? (processed / total) * 100 : 0;

  if (phase === "failed") {
    return (
      <OnboardingShell step={scanContent.step}>
        <IconBlock>
          <CircleAlert className="size-6 text-destructive" />
        </IconBlock>
        <header className="flex flex-col gap-1.5 text-center">
          <Typography variant="h2">{scanContent.failed.title}</Typography>
          <Typography variant="lead">{scanContent.failed.message}</Typography>
        </header>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => window.location.reload()}
            className="h-12 w-full rounded-full text-sm font-semibold"
          >
            {scanContent.failed.retryCta}
          </Button>
          <Link
            href="/profile-setup"
            className="self-center rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {scanContent.failed.skipCta}
          </Link>
        </div>
      </OnboardingShell>
    );
  }

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
            {phase === "preparing"
              ? scanContent.preparingLabel
              : scanContent.processingLabel}
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
            ? scanContent.doneLabel
            : secondsRemaining !== null
              ? `~${secondsRemaining} seconds ${scanContent.remainingSuffix}`
              : scanContent.preparingLabel}
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
            {found.length} {scanContent.subscriptionsLabel}
          </Typography>
        </div>

        <ul className="flex flex-col gap-2">
          {found.map((subscription, index) => {
            const isNewest = !isDone && index === found.length - 1;
            return (
              <li
                key={subscription.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 duration-500 animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center gap-2.5">
                  <Typography
                    as="span"
                    variant="caption"
                    aria-hidden="true"
                    className="flex size-6 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground"
                  >
                    {subscription.displayName.charAt(0)}
                  </Typography>
                  <Typography as="span" variant="body" className="font-medium">
                    {subscription.displayName}
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
                    {formatINR(subscription.amountInr)}
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
