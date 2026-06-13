"use client";

import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { SubscriptionGroupHeader } from "@/components/dashboard/SubscriptionGroupHeader";
import type {
  DisplaySubscription,
  SubscriptionGroup,
} from "@/utils/subscriptionFilters";

interface SubscriptionGridViewProps {
  groups: SubscriptionGroup[];
  onEdit: (subscription: DisplaySubscription) => void;
  onDelete: (subscription: DisplaySubscription) => void;
}

export const SubscriptionGridView = ({
  groups,
  onEdit,
  onDelete,
}: SubscriptionGridViewProps) => {
  return (
    <div className="flex flex-col gap-7">
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-3">
          <SubscriptionGroupHeader
            label={group.label}
            count={group.items.length}
            total={group.total}
            accent={group.key === "renewing"}
          />
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((subscription) => (
              <li key={subscription.id}>
                <SubscriptionCard
                  subscription={subscription}
                  onEdit={() => onEdit(subscription)}
                  onDelete={() => onDelete(subscription)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
