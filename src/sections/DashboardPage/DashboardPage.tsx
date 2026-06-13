"use client";

import { LoaderCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AppLogo } from "@/components/common/AppLogo";
import { CountUp } from "@/components/common/CountUp";
import { Typography } from "@/components/common/Typography";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { AddSubscriptionForm } from "@/components/forms/AddSubscriptionForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dashboardContent } from "@/data/dashboard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { supabase } from "@/lib/supabase";
import { formatINR } from "@/utils/formatCurrency";
import {
  activeSubscriptionCount,
  annualTotalINR,
  monthlyEquivalentINR,
} from "@/utils/subscriptionMath";

export const DashboardPage = () => {
  const { subscriptions, status, refetch } = useSubscriptions();
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Catalog names for any service-linked rows; manual rows use manual_name.
  useEffect(() => {
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

  const isLoading = status === "idle" || status === "loading";
  const annualTotal = annualTotalINR(subscriptions);
  const monthlyEquivalent = monthlyEquivalentINR(subscriptions);
  const activeCount = activeSubscriptionCount(subscriptions);
  const isEmpty = !isLoading && subscriptions.length === 0;

  const displayName = (subscription: (typeof subscriptions)[number]): string =>
    (subscription.service_id && serviceNames[subscription.service_id]) ||
    subscription.manual_name ||
    "Subscription";

  const handleAdded = () => {
    setIsAddOpen(false);
    void refetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("subscriptions").delete().eq("id", id);
    void refetch();
  };

  const addDialog = (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-full text-sm font-semibold">
          <Plus aria-hidden="true" className="size-4" />
          {dashboardContent.addCta}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dashboardContent.form.title}</DialogTitle>
          <DialogDescription>
            {dashboardContent.form.description}
          </DialogDescription>
        </DialogHeader>
        <AddSubscriptionForm onSuccess={handleAdded} />
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex min-h-dvh flex-col bg-linear-to-b from-background to-surface-tint">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
        <AppLogo />
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/account">{dashboardContent.accountCta}</Link>
        </Button>
      </header>

      <main className="flex flex-1 justify-center px-4 py-8 sm:py-10">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <Typography variant="h2">{dashboardContent.title}</Typography>
            {!isEmpty && addDialog}
          </div>

          {isLoading ? (
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
          ) : isEmpty ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-14 text-center">
              <div className="flex flex-col gap-1.5">
                <Typography variant="h3">
                  {dashboardContent.empty.title}
                </Typography>
                <Typography variant="small">
                  {dashboardContent.empty.message}
                </Typography>
              </div>
              {addDialog}
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-1.5 rounded-xl bg-linear-to-b from-secondary to-secondary/40 px-4 py-7 text-center">
                <Typography
                  as="span"
                  variant="caption"
                  className="font-semibold tracking-wider text-pill-foreground/80 uppercase"
                >
                  {dashboardContent.summary.perYearLabel}
                </Typography>
                <CountUp
                  value={annualTotal}
                  prefix="₹"
                  className="text-4xl font-bold tracking-tight text-primary tabular-nums sm:text-5xl"
                />
                <Typography
                  as="span"
                  variant="small"
                  className="text-pill-foreground"
                >
                  {formatINR(monthlyEquivalent)}
                  {dashboardContent.summary.monthSuffix} · {activeCount}{" "}
                  {dashboardContent.summary.subsSuffix}
                </Typography>
              </div>

              <ul className="flex flex-col gap-2.5">
                {subscriptions.map((subscription) => (
                  <li key={subscription.id}>
                    <SubscriptionCard
                      name={displayName(subscription)}
                      amountInr={Number(subscription.amount_inr)}
                      billingCycle={subscription.billing_cycle}
                      nextRenewalDate={subscription.next_renewal_date}
                      onDelete={() => handleDelete(subscription.id)}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
