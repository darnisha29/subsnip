import * as yup from "yup";

import type { Database } from "@/types/supabase";

export type BillingCycle = Database["public"]["Enums"]["billing_cycle"];

const BILLING_CYCLES: BillingCycle[] = [
  "weekly",
  "monthly",
  "quarterly",
  "semi_annual",
  "annual",
  "lifetime",
];

export const addSubscriptionSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  amount: yup
    .number()
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .max(2000000, "That amount looks too high")
    .required("Amount is required"),
  billingCycle: yup
    .mixed<BillingCycle>()
    .oneOf(BILLING_CYCLES, "Choose a billing cycle")
    .required("Choose a billing cycle"),
  nextRenewalDate: yup.string().default(""),
});

export type AddSubscriptionFormValues = yup.InferType<
  typeof addSubscriptionSchema
>;
