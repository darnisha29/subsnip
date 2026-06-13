export const dashboardContent = {
  title: "Your subscriptions",
  accountCta: "Account",
  summary: {
    perYearLabel: "Total · per year",
    monthSuffix: "/month",
    subsSuffix: "active subscriptions",
  },
  addCta: "Add subscription",
  empty: {
    title: "No subscriptions yet",
    message: "Add your first subscription to start tracking your spend.",
  },
  list: {
    renewsLabel: "Renews",
    noRenewal: "No renewal date",
  },
  deleteDialog: {
    title: "Delete this subscription?",
    description:
      "This removes it from your dashboard and spend totals. You can add it again later.",
    cancel: "Keep it",
    confirm: "Delete",
  },
  form: {
    title: "Add a subscription",
    description: "Track a subscription manually.",
    name: { label: "Name", placeholder: "e.g. Netflix" },
    amount: { label: "Amount (₹)", placeholder: "499" },
    billingCycle: {
      label: "Billing cycle",
      placeholder: "Select a cycle",
      options: [
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "quarterly", label: "Quarterly" },
        { value: "semi_annual", label: "Every 6 months" },
        { value: "annual", label: "Yearly" },
        { value: "lifetime", label: "Lifetime" },
      ],
    },
    nextRenewalDate: { label: "Next renewal (optional)" },
    submitCta: "Add subscription",
    submittingCta: "Adding…",
  },
} as const;
