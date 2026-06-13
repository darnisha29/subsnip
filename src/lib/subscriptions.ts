import type { Database, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { SubscriptionFormValues } from "@/lib/validations/subscription";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

// Maps the manual-entry form to the subscriptions Insert shape per the
// subsnip-be contract: no catalog service, so service_id stays null and the
// name lives in manual_name. Manual amounts are entered in INR, so amount and
// amount_inr match.
export const buildSubscriptionInsert = (
  values: SubscriptionFormValues,
  userId: string,
): TablesInsert<"subscriptions"> => ({
  user_id: userId,
  service_id: null,
  manual_name: values.name.trim(),
  amount: values.amount,
  currency: "INR",
  amount_inr: values.amount,
  billing_cycle: values.billingCycle,
  next_renewal_date: values.nextRenewalDate || null,
  user_category: values.category || null,
  status: values.isTrial ? "trial" : "active",
  is_trial: values.isTrial,
  trial_ends_at: values.isTrial ? values.nextRenewalDate || null : null,
  detection_source: "manual",
  confidence_score: 1,
});

// Edit only touches the user-editable columns. manual_name is written solely
// for manual rows; catalog-linked rows keep their service-derived name.
export const buildSubscriptionUpdate = (
  values: SubscriptionFormValues,
  existing: Subscription,
): TablesUpdate<"subscriptions"> => ({
  ...(existing.service_id ? {} : { manual_name: values.name.trim() }),
  amount: values.amount,
  amount_inr: existing.currency === "INR" ? values.amount : existing.amount_inr,
  billing_cycle: values.billingCycle,
  next_renewal_date: values.nextRenewalDate || null,
  user_category: values.category || null,
  status: values.isTrial ? "trial" : "active",
  is_trial: values.isTrial,
  trial_ends_at: values.isTrial ? values.nextRenewalDate || null : null,
});
