"use client";

import { Typography } from "@/components/common/Typography";
import { SubscriptionGroupHeader } from "@/components/dashboard/SubscriptionGroupHeader";
import { LIST_GRID, SubscriptionRow } from "@/components/dashboard/SubscriptionRow";
import { Card } from "@/components/ui/card";
import { dashboardContent } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import type {
  DisplaySubscription,
  SubscriptionGroup,
} from "@/utils/subscriptionFilters";

interface SubscriptionListViewProps {
  groups: SubscriptionGroup[];
  onEdit: (subscription: DisplaySubscription) => void;
  onDelete: (subscription: DisplaySubscription) => void;
}

const columns = dashboardContent.columns;

const HeaderCell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Typography
    as="span"
    variant="caption"
    className={cn("font-semibold tracking-wider uppercase", className)}
  >
    {children}
  </Typography>
);

export const SubscriptionListView = ({
  groups,
  onEdit,
  onDelete,
}: SubscriptionListViewProps) => {
  return (
    <Card className="gap-0 py-0 ring-border">
      <div className={cn(LIST_GRID, "border-b border-border px-4 py-2.5")}>
        <HeaderCell>{columns.service}</HeaderCell>
        <HeaderCell className="hidden sm:block">{columns.category}</HeaderCell>
        <HeaderCell className="hidden sm:block">{columns.renewal}</HeaderCell>
        <HeaderCell className="text-right">{columns.amount}</HeaderCell>
      </div>

      {groups.map((group) => (
        <div key={group.key}>
          <SubscriptionGroupHeader
            label={group.label}
            count={group.items.length}
            total={group.total}
            accent={group.key === "renewing"}
            className="bg-muted/40 px-4 py-2"
          />
          {group.items.map((subscription) => (
            <SubscriptionRow
              key={subscription.id}
              subscription={subscription}
              onEdit={() => onEdit(subscription)}
              onDelete={() => onDelete(subscription)}
            />
          ))}
        </div>
      ))}
    </Card>
  );
};
