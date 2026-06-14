import type { Database } from "@/types/supabase";
import { daysUntil } from "@/utils/formatDate";
import { RENEWING_SOON_DAYS } from "@/utils/subscriptionMath";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

// A row augmented with resolved display fields so filtering, sorting and
// grouping never need the services lookup map.
export type DisplaySubscription = Subscription & {
  displayName: string;
  displayCategory: string | null;
};

export type FilterKey = "all" | "renewing" | "trials";
export type SortKey = "renewal" | "name" | "amount";
export type ViewMode = "grid" | "list" | "calendar";

// Calendar colour state for a renewal: trial wins over timing, then by how soon
// it falls relative to today. Used for chips, dots and the legend.
export type RenewalStatus = "urgent" | "week" | "trial" | "upcoming";

export const isTrialRow = (subscription: Subscription): boolean =>
  subscription.status === "trial" || subscription.is_trial;

export const renewalStatus = (subscription: Subscription): RenewalStatus => {
  if (isTrialRow(subscription)) {
    return "trial";
  }
  if (!subscription.next_renewal_date) {
    return "upcoming";
  }
  const days = daysUntil(subscription.next_renewal_date);
  if (days >= 0 && days <= 1) {
    return "urgent";
  }
  if (days >= 0 && days <= RENEWING_SOON_DAYS) {
    return "week";
  }
  return "upcoming";
};

export const isRenewingSoon = (
  subscription: Subscription,
  withinDays = RENEWING_SOON_DAYS,
): boolean => {
  if (subscription.status !== "active" && subscription.status !== "trial") {
    return false;
  }
  if (!subscription.next_renewal_date) {
    return false;
  }
  const days = daysUntil(subscription.next_renewal_date);
  return days >= 0 && days <= withinDays;
};

// Distinct, alphabetically ordered categories present across the rows — feeds
// the toolbar category filter.
export const distinctCategories = (
  subscriptions: DisplaySubscription[],
): string[] =>
  [
    ...new Set(
      subscriptions
        .map((subscription) => subscription.displayCategory)
        .filter((category): category is string => Boolean(category)),
    ),
  ].sort((a, b) => a.localeCompare(b));

export const filterSubscriptions = (
  subscriptions: DisplaySubscription[],
  filter: FilterKey,
  category: string | null,
): DisplaySubscription[] =>
  subscriptions.filter((subscription) => {
    if (filter === "renewing" && !isRenewingSoon(subscription)) {
      return false;
    }
    if (filter === "trials" && !isTrialRow(subscription)) {
      return false;
    }
    if (category && subscription.displayCategory !== category) {
      return false;
    }
    return true;
  });

// Sorts a copy; renewal sort puts dated rows first (soonest first) and pushes
// undated rows to the end.
export const sortSubscriptions = (
  subscriptions: DisplaySubscription[],
  sort: SortKey,
): DisplaySubscription[] =>
  [...subscriptions].sort((a, b) => {
    if (sort === "name") {
      return a.displayName.localeCompare(b.displayName);
    }
    if (sort === "amount") {
      return Number(b.amount_inr) - Number(a.amount_inr);
    }
    const aDate = a.next_renewal_date ?? "";
    const bDate = b.next_renewal_date ?? "";
    if (!aDate) {
      return bDate ? 1 : 0;
    }
    if (!bDate) {
      return -1;
    }
    return aDate.localeCompare(bDate);
  });

// Splits into the renewing-this-week group and everything else, preserving the
// incoming (already-sorted) order within each group.
export const groupByRenewal = (
  subscriptions: DisplaySubscription[],
): { soon: DisplaySubscription[]; rest: DisplaySubscription[] } => {
  const soon: DisplaySubscription[] = [];
  const rest: DisplaySubscription[] = [];
  for (const subscription of subscriptions) {
    if (isRenewingSoon(subscription)) {
      soon.push(subscription);
    } else {
      rest.push(subscription);
    }
  }
  return { soon, rest };
};

export interface SubscriptionGroup {
  key: string;
  label: string;
  items: DisplaySubscription[];
  total?: number;
}

const sumInr = (subscriptions: DisplaySubscription[]): number =>
  Math.round(
    subscriptions.reduce((total, item) => total + Number(item.amount_inr), 0),
  );

// Turns an already-filtered + sorted list into display groups. "All" splits
// into renewing-this-week (with a charge total) and the rest; the focused
// filters collapse to a single labelled group.
export const groupSubscriptions = (
  subscriptions: DisplaySubscription[],
  filter: FilterKey,
  labels: { renewing: string; active: string; trials: string },
): SubscriptionGroup[] => {
  if (filter === "trials") {
    return [{ key: "trials", label: labels.trials, items: subscriptions }];
  }
  if (filter === "renewing") {
    return [
      {
        key: "renewing",
        label: labels.renewing,
        items: subscriptions,
        total: sumInr(subscriptions),
      },
    ];
  }
  const { soon, rest } = groupByRenewal(subscriptions);
  const groups: SubscriptionGroup[] = [];
  if (soon.length > 0) {
    groups.push({
      key: "renewing",
      label: labels.renewing,
      items: soon,
      total: sumInr(soon),
    });
  }
  if (rest.length > 0) {
    groups.push({ key: "active", label: labels.active, items: rest });
  }
  return groups;
};
