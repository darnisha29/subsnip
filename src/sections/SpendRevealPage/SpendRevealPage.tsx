"use client";

import { ArrowRight, Square } from "lucide-react";
import { useEffect, useState } from "react";

import { CountUp } from "@/components/common/CountUp";
import { NavButton } from "@/components/common/NavButton";
import { Typography } from "@/components/common/Typography";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { spendRevealContent } from "@/data/onboarding";
import { supabase } from "@/lib/supabase";

export const SpendRevealPage = () => {
  const [firstName, setFirstName] = useState<string | null>(null);

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
  }, []);

  const greeting = firstName
    ? `${firstName}, ${spendRevealContent.greetingSuffix}`
    : spendRevealContent.fallbackGreeting;

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
          value={spendRevealContent.amount}
          prefix="₹"
          className="text-5xl font-bold tracking-tight text-primary tabular-nums sm:text-6xl"
        />
        <Typography as="span" variant="small" className="text-pill-foreground">
          {spendRevealContent.meta}
        </Typography>
      </div>

      <div className="flex flex-col gap-2.5">
        <Typography
          as="span"
          variant="caption"
          className="font-semibold tracking-wider uppercase"
        >
          {spendRevealContent.forgottenLabel} ·{" "}
          {spendRevealContent.forgotten.length} {spendRevealContent.foundLabel}
        </Typography>
        <ul className="flex flex-col gap-2">
          {spendRevealContent.forgotten.map((item) => (
            <li
              key={item.name}
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
                    {item.name}
                  </Typography>
                  <Typography as="span" variant="small">
                    {item.reason}
                  </Typography>
                </div>
              </div>
              <Typography
                as="span"
                variant="small"
                className="font-semibold whitespace-nowrap text-destructive"
              >
                {item.amount}
              </Typography>
            </li>
          ))}
        </ul>
      </div>

      <NavButton
        href="/link-telegram"
        trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}
        className="h-12 w-full rounded-full text-sm font-semibold"
      >
        {spendRevealContent.cta}
      </NavButton>
    </OnboardingShell>
  );
};
