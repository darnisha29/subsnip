import type { Database } from "@/types/supabase";
import { daysUntil } from "@/utils/formatDate";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type BillingCycle = Database["public"]["Enums"]["billing_cycle"];

export const RENEWING_SOON_DAYS = 7;

const CYCLES_PER_YEAR: Record<BillingCycle, number> = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  semi_annual: 2,
  annual: 1,
  lifetime: 0,
  unknown: 12,
};

const FORGOTTEN_AFTER_DAYS = 45;

const activeOnly = (subscriptions: Subscription[]) =>
  subscriptions.filter(
    (subscription) =>
      subscription.status === "active" || subscription.status === "trial",
  );

export const annualTotalINR = (subscriptions: Subscription[]): number =>
  Math.round(
    activeOnly(subscriptions).reduce(
      (total, subscription) =>
        total +
        Number(subscription.amount_inr) *
          CYCLES_PER_YEAR[subscription.billing_cycle],
      0,
    ),
  );

export const monthlyEquivalentINR = (subscriptions: Subscription[]): number =>
  Math.round(annualTotalINR(subscriptions) / 12);

export const activeSubscriptionCount = (
  subscriptions: Subscription[],
): number => activeOnly(subscriptions).length;

// Active rows whose next renewal falls within the next `withinDays` days
// (today counts as 0). Rows without a renewal date are excluded.
export const renewingSoon = (
  subscriptions: Subscription[],
  withinDays = RENEWING_SOON_DAYS,
): Subscription[] =>
  activeOnly(subscriptions).filter((subscription) => {
    if (!subscription.next_renewal_date) {
      return false;
    }
    const days = daysUntil(subscription.next_renewal_date);
    return days >= 0 && days <= withinDays;
  });

// Total INR charged by the rows renewing in the window — the "this week" stat.
export const renewingSoonTotalINR = (
  subscriptions: Subscription[],
  withinDays = RENEWING_SOON_DAYS,
): number =>
  Math.round(
    renewingSoon(subscriptions, withinDays).reduce(
      (total, subscription) => total + Number(subscription.amount_inr),
      0,
    ),
  );

export const trialSubscriptions = (
  subscriptions: Subscription[],
): Subscription[] =>
  subscriptions.filter(
    (subscription) =>
      subscription.status === "trial" || subscription.is_trial,
  );

// "Likely forgotten": still active but no charge email seen recently, or a
// trial that quietly converts.
export const likelyForgotten = (
  subscriptions: Subscription[],
): Subscription[] => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - FORGOTTEN_AFTER_DAYS);
  const cutoffDate = cutoff.toISOString().slice(0, 10);

  return activeOnly(subscriptions).filter(
    (subscription) =>
      subscription.is_trial ||
      (subscription.last_charge_date !== null &&
        subscription.last_charge_date < cutoffDate),
  );
};
