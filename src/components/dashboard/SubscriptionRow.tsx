"use client";

import { Typography } from "@/components/common/Typography";
import { SubscriptionActions } from "@/components/dashboard/SubscriptionActions";
import { SubscriptionAvatar } from "@/components/dashboard/SubscriptionAvatar";
import { SubscriptionBadges } from "@/components/dashboard/SubscriptionBadges";
import { CYCLE_PHRASE, CYCLE_SUFFIX, dashboardContent } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { formatINR } from "@/utils/formatCurrency";
import { daysUntil, renewalPhrase } from "@/utils/formatDate";
import type { DisplaySubscription } from "@/utils/subscriptionFilters";

// Shared column template so the header and rows line up. Category and renewal
// columns collapse away on small screens, leaving service + amount.
export const LIST_GRID =
  "grid grid-cols-[1.6fr_auto] items-center gap-3 sm:grid-cols-[1.8fr_1fr_1fr_auto] sm:gap-4";

interface SubscriptionRowProps {
  subscription: DisplaySubscription;
  onEdit: () => void;
  onDelete: () => void;
}

export const SubscriptionRow = ({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionRowProps) => {
  const renewal = subscription.next_renewal_date;
  const urgent = renewal !== null && daysUntil(renewal) <= 1;

  return (
    <div
      className={cn(
        LIST_GRID,
        "border-t border-border px-4 py-3 transition-colors first:border-t-0 hover:bg-muted/40",
      )}
    >
      {/* Service */}
      <div className="flex min-w-0 items-center gap-3">
        <SubscriptionAvatar name={subscription.displayName} className="size-9" />
        <div className="flex min-w-0 flex-col">
          <span className="flex items-center gap-2">
            <Typography
              as="span"
              variant="body"
              className="truncate text-sm font-semibold"
            >
              {subscription.displayName}
            </Typography>
            <SubscriptionBadges subscription={subscription} />
          </span>
          <Typography as="span" variant="caption" className="capitalize">
            {CYCLE_PHRASE[subscription.billing_cycle]}
          </Typography>
        </div>
      </div>

      {/* Category */}
      <div className="hidden sm:flex">
        {subscription.displayCategory && (
          <Typography
            as="span"
            variant="inherit"
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground capitalize"
          >
            {subscription.displayCategory}
          </Typography>
        )}
      </div>

      {/* Renewal */}
      <div className="hidden sm:flex">
        <Typography
          as="span"
          variant="small"
          className={cn(urgent && "font-medium text-destructive")}
        >
          {renewal
            ? renewalPhrase(renewal)
            : dashboardContent.list.noRenewal}
        </Typography>
      </div>

      {/* Amount + actions */}
      <div className="flex items-center justify-end gap-1.5">
        <Typography
          as="span"
          variant="body"
          className="text-sm font-semibold whitespace-nowrap tabular-nums"
        >
          {formatINR(Number(subscription.amount_inr))}
          <Typography as="span" variant="inherit" className="text-tertiary">
            {CYCLE_SUFFIX[subscription.billing_cycle]}
          </Typography>
        </Typography>
        <SubscriptionActions
          name={subscription.displayName}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};
