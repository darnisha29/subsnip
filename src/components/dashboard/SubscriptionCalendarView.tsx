"use client";

import { useMemo } from "react";

import { CalendarGrid } from "@/components/dashboard/CalendarGrid";
import { CalendarSidebar } from "@/components/dashboard/CalendarSidebar";
import {
  buildMonthMatrix,
  buildWeekMatrix,
  type CalendarMode,
} from "@/utils/calendar";
import type { DisplaySubscription } from "@/utils/subscriptionFilters";

interface SubscriptionCalendarViewProps {
  subscriptions: DisplaySubscription[];
  anchor: Date;
  mode: CalendarMode;
  onSelect: (subscription: DisplaySubscription) => void;
}

export const SubscriptionCalendarView = ({
  subscriptions,
  anchor,
  mode,
  onSelect,
}: SubscriptionCalendarViewProps) => {
  const byDate = useMemo(() => {
    const map = new Map<string, DisplaySubscription[]>();
    for (const subscription of subscriptions) {
      const iso = subscription.next_renewal_date;
      if (!iso) {
        continue;
      }
      const bucket = map.get(iso);
      if (bucket) {
        bucket.push(subscription);
      } else {
        map.set(iso, [subscription]);
      }
    }
    return map;
  }, [subscriptions]);

  const matrix =
    mode === "month"
      ? buildMonthMatrix(anchor, new Date())
      : buildWeekMatrix(anchor, new Date());

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
      <CalendarGrid
        matrix={matrix}
        byDate={byDate}
        maxChips={mode === "month" ? 2 : 6}
        onSelect={onSelect}
      />
      <CalendarSidebar
        subscriptions={subscriptions}
        anchor={anchor}
        onSelect={onSelect}
      />
    </div>
  );
};
