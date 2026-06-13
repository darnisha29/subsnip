import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";
import { isTrialRow } from "@/utils/subscriptionFilters";
import type { DisplaySubscription } from "@/utils/subscriptionFilters";

interface SubscriptionBadgesProps {
  subscription: DisplaySubscription;
  className?: string;
}

const pillClass =
  "rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wide uppercase";

// Non-renewal tags shared by the grid card and the list row: the original
// currency (when not INR) and a trial marker. Renders nothing when neither
// applies.
export const SubscriptionBadges = ({
  subscription,
  className,
}: SubscriptionBadgesProps) => {
  const showCurrency = subscription.currency !== "INR";
  const showTrial = isTrialRow(subscription);

  if (!showCurrency && !showTrial) {
    return null;
  }

  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      {showCurrency && (
        <Typography
          as="span"
          variant="inherit"
          className={cn(pillClass, "bg-muted text-muted-foreground")}
        >
          {subscription.currency}
        </Typography>
      )}
      {showTrial && (
        <Typography
          as="span"
          variant="inherit"
          className={cn(pillClass, "bg-success-tint text-success")}
        >
          Trial
        </Typography>
      )}
    </span>
  );
};
