export const dashboardContent = {
  title: "Subscriptions",
  // Subtitle: "{count} active · ₹{outflow} monthly outflow" is composed in the
  // header from live data.
  activeSuffix: "active",
  outflowSuffix: "monthly outflow",
  addCta: "Add subscription",
  accountCta: "Account",

  stats: {
    monthly: { label: "Monthly", caption: "Across {count} subs" },
    annual: { label: "Annual", caption: "At current rate" },
    thisWeek: { label: "This week", caption: "{count} renewing" },
    trials: { label: "Trials", caption: "in trial now" },
  },

  filters: {
    all: "All",
    renewing: "Renewing soon",
    trials: "Trials",
    categoryAll: "All categories",
    categoryLabel: "Category",
  },

  sort: {
    label: "Sort",
    renewal: "Renewal date",
    name: "Name",
    amount: "Amount",
  },

  view: {
    grid: "Grid view",
    list: "List view",
    calendar: "Calendar view",
  },

  calendar: {
    today: "Today",
    prev: "Previous",
    next: "Next",
    week: "Week",
    month: "Month",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    more: "more",
    overviewSuffix: "overview",
    totalSpend: "Total spend",
    renewals: "Renewals",
    comingUp: "Coming up (7d)",
    trialsEnding: "Trials ending",
    legendTitle: "Legend",
    legend: {
      urgent: "Renews ≤ 1 day",
      week: "Renews this week",
      upcoming: "Upcoming",
      trial: "Trial ending",
    },
    upNextTitle: "Up next",
    upNextEmpty: "No upcoming renewals.",
  },

  groups: {
    renewingThisWeek: "Renewing this week",
    active: "Active",
  },

  columns: {
    service: "Service",
    category: "Category",
    renewal: "Renewal",
    amount: "Amount",
  },

  empty: {
    title: "No subscriptions yet",
    message: "Add your first subscription to start tracking your spend.",
  },

  noMatches: "Nothing matches these filters.",

  list: {
    renewsLabel: "Renews",
    noRenewal: "No renewal date",
    trialBadge: "TRIAL",
  },

  actions: {
    menuLabel: "Open actions",
    edit: "Edit",
    delete: "Delete",
  },

  deleteDialog: {
    title: "Delete this subscription?",
    description:
      "This removes it from your dashboard and spend totals. You can add it again later.",
    cancel: "Keep it",
    confirm: "Delete",
  },

  form: {
    addTitle: "Add a subscription",
    addDescription: "Track a subscription manually.",
    editTitle: "Edit subscription",
    editDescription: "Update the details for this subscription.",
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
    category: {
      label: "Category (optional)",
      placeholder: "Select a category",
      options: [
        { value: "Entertainment", label: "Entertainment" },
        { value: "Music", label: "Music" },
        { value: "Productivity", label: "Productivity" },
        { value: "AI", label: "AI" },
        { value: "Fitness", label: "Fitness" },
        { value: "Learning", label: "Learning" },
        { value: "Audiobooks", label: "Audiobooks" },
        { value: "News", label: "News" },
        { value: "Shopping", label: "Shopping" },
        { value: "Utilities", label: "Utilities" },
        { value: "Other", label: "Other" },
      ],
    },
    nextRenewalDate: { label: "Next renewal (optional)" },
    trial: { label: "This is a free trial" },
    addSubmitCta: "Add subscription",
    addSubmittingCta: "Adding…",
    editSubmitCta: "Save changes",
    editSubmittingCta: "Saving…",
  },
} as const;

// INR per-cycle suffix, e.g. "/mo". Shared by cards and rows.
export const CYCLE_SUFFIX: Record<string, string> = {
  weekly: "/wk",
  monthly: "/mo",
  quarterly: "/qtr",
  semi_annual: "/6mo",
  annual: "/yr",
  lifetime: "",
  unknown: "/mo",
};

// Long per-cycle phrase, e.g. "per month". Used under the amount on cards.
export const CYCLE_PHRASE: Record<string, string> = {
  weekly: "per week",
  monthly: "per month",
  quarterly: "per quarter",
  semi_annual: "per 6 months",
  annual: "per year",
  lifetime: "one-time",
  unknown: "per month",
};
