"use client";

import { ArrowRight, LoaderCircle, Square } from "lucide-react";
import { useEffect, useState } from "react";

import { CountUp } from "@/components/common/CountUp";
import { NavButton } from "@/components/common/NavButton";
import { Typography } from "@/components/common/Typography";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { spendRevealContent } from "@/data/onboarding";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { supabase } from "@/lib/supabase";
import { formatINR } from "@/utils/formatCurrency";
import {
  activeSubscriptionCount,
  annualTotalINR,
  likelyForgotten,
  monthlyEquivalentINR,
} from "@/utils/subscriptionMath";

const CYCLE_SUFFIX: Record<string, string> = {
  weekly: "/wk",
  monthly: "/mo",
  quarterly: "/qtr",
  semi_annual: "/6mo",
  annual: "/yr",
  lifetime: "",
  unknown: "/mo",
};

export const SpendRevealPage = () => {
  const { subscriptions, status } = useSubscriptions();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const metadata = data.user?.user_metadata as
        | Record<string, unknown>
        | undefined;
      const fullName = metadata?.full_name;
      if (typeof fullName === "string" && fullName.length > 0) {
        setFirstName(fullName.split(" ")[0]);
      }
    });
    supabase
      .from("services")
      .select("id, name")
      .then(({ data }) => {
        if (data) {
          setServiceNames(
            Object.fromEntries(
              data.map((service) => [service.id, service.name]),
            ),
          );
        }
      });
  }, []);

  const greeting = firstName
    ? `${firstName}, ${spendRevealContent.greetingSuffix}`
    : spendRevealContent.fallbackGreeting;

  const isLoading = status === "idle" || status === "loading";
  const annualTotal = annualTotalINR(subscriptions);
  const monthlyEquivalent = monthlyEquivalentINR(subscriptions);
  const activeCount = activeSubscriptionCount(subscriptions);
  const forgotten = likelyForgotten(subscriptions);
  const isEmpty = !isLoading && activeCount === 0;

  const continueCta = (
    <NavButton
      href="/link-telegram"
      trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}
      className="h-12 w-full rounded-full text-sm font-semibold"
    >
      {spendRevealContent.cta}
    </NavButton>
  );

  if (isLoading) {
    return (
      <OnboardingShell step={spendRevealContent.step}>
        <div
          role="status"
          aria-label="Loading"
          className="flex justify-center py-20"
        >
          <LoaderCircle
            aria-hidden="true"
            className="size-7 animate-spin text-primary"
          />
        </div>
      </OnboardingShell>
    );
  }

  if (isEmpty) {
    return (
      <OnboardingShell step={spendRevealContent.step}>
        <header className="flex flex-col gap-1.5 text-center">
          <Typography variant="h2">{spendRevealContent.empty.title}</Typography>
          <Typography variant="lead">
            {spendRevealContent.empty.message}
          </Typography>
        </header>
        {continueCta}
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell step={spendRevealContent.step}>
      <header className="flex flex-col gap-1.5 text-center">
        <Typography variant="lead">{greeting}</Typography>
        <Typography variant="h2" className="text-balance">
          {spendRevealContent.title}
        </Typography>
      </header>

      <div className="flex flex-col items-center gap-1.5 rounded-xl bg-linear-to-b from-secondary to-secondary/40 px-4 py-7 text-center">
        <Typography
          as="span"
          variant="caption"
          className="font-semibold tracking-wider text-pill-foreground/80 uppercase"
        >
          {spendRevealContent.perYearLabel}
        </Typography>
        <CountUp
          value={annualTotal}
          prefix="₹"
          className="text-5xl font-bold tracking-tight text-primary tabular-nums sm:text-6xl"
        />
        <Typography as="span" variant="small" className="text-pill-foreground">
          {formatINR(monthlyEquivalent)}
          {spendRevealContent.monthSuffix} · {activeCount}{" "}
          {spendRevealContent.subsSuffix}
        </Typography>
      </div>

      {forgotten.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {spendRevealContent.forgottenLabel} · {forgotten.length}{" "}
            {spendRevealContent.foundLabel}
          </Typography>
          <ul className="flex flex-col gap-2">
            {forgotten.map((subscription) => (
              <li
                key={subscription.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Square
                    aria-hidden="true"
                    className="size-4 shrink-0 text-destructive"
                  />
                  <div className="flex flex-col">
                    <Typography
                      as="span"
                      variant="body"
                      className="font-semibold"
                    >
                      {(subscription.service_id &&
                        serviceNames[subscription.service_id]) ??
                        subscription.manual_name ??
                        "Subscription"}
                    </Typography>
                    <Typography as="span" variant="small">
                      {subscription.is_trial
                        ? spendRevealContent.trialReason
                        : spendRevealContent.staleReason}
                    </Typography>
                  </div>
                </div>
                <Typography
                  as="span"
                  variant="small"
                  className="font-semibold whitespace-nowrap text-destructive"
                >
                  {formatINR(Number(subscription.amount_inr))}
                  {CYCLE_SUFFIX[subscription.billing_cycle]}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      )}

      {continueCta}
    </OnboardingShell>
  );
};
