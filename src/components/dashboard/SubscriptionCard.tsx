"use client";

import { Typography } from "@/components/common/Typography";
import { SubscriptionActions } from "@/components/dashboard/SubscriptionActions";
import { SubscriptionAvatar } from "@/components/dashboard/SubscriptionAvatar";
import { SubscriptionBadges } from "@/components/dashboard/SubscriptionBadges";
import { Card, CardContent } from "@/components/ui/card";
import { CYCLE_PHRASE } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { formatINR } from "@/utils/formatCurrency";
import { daysUntil, renewalChip, renewalPhrase } from "@/utils/formatDate";
import type { DisplaySubscription } from "@/utils/subscriptionFilters";

interface SubscriptionCardProps {
  subscription: DisplaySubscription;
  onEdit: () => void;
  onDelete: () => void;
}

export const SubscriptionCard = ({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionCardProps) => {
  const renewal = subscription.next_renewal_date;
  const chip = renewal ? renewalChip(renewal) : null;
  const urgent = renewal !== null && daysUntil(renewal) <= 1;
  const meta = [subscription.displayCategory, CYCLE_PHRASE[subscription.billing_cycle]]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="h-full gap-0 py-0 ring-border transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <SubscriptionAvatar name={subscription.displayName} />
          <div className="flex items-center gap-1.5">
            {chip && (
              <Typography
                as="span"
                variant="inherit"
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.625rem] font-semibold tracking-wide uppercase",
                  urgent
                    ? "bg-destructive/10 text-destructive"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {chip}
              </Typography>
            )}
            <SubscriptionActions
              name={subscription.displayName}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Typography
              as="span"
              variant="body"
              className="truncate font-semibold"
            >
              {subscription.displayName}
            </Typography>
            <SubscriptionBadges subscription={subscription} />
          </div>
          {meta && (
            <Typography as="span" variant="small" className="capitalize">
              {meta}
            </Typography>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <Typography
              as="span"
              className="text-2xl font-bold tracking-tight tabular-nums"
            >
              {formatINR(Number(subscription.amount_inr))}
            </Typography>
            <Typography as="span" variant="caption">
              {subscription.currency !== "INR" &&
                `${subscription.currency} ${subscription.amount} · `}
              {CYCLE_PHRASE[subscription.billing_cycle]}
            </Typography>
          </div>
          {renewal && (
            <Typography
              as="span"
              variant="small"
              className={cn(
                "shrink-0 font-medium",
                urgent ? "text-destructive" : "text-tertiary",
              )}
            >
              {renewalPhrase(renewal)}
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
