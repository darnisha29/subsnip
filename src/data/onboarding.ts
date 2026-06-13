export const connectGmailContent = {
  step: 1,
  title: "Find your forgotten subs",
  subtitle: "We'll scan your Gmail for recurring charges. Takes 60 seconds.",
  trustSignals: [
    {
      title: "Read-only access",
      description: "We can't send, reply, or delete anything.",
    },
    {
      title: "Emails never stored",
      description: "Parsed on-device. We keep only the metadata.",
    },
  ],
  cta: "Connect Gmail",
  skip: "Skip — I'll add subs manually",
  errorMessage: "Couldn't connect Gmail. Please try again.",
} as const;

export const scanContent = {
  step: 2,
  title: "Scanning your inbox",
  subtitle: "Sit tight — finding receipts for recurring charges.",
  preparingLabel: "Preparing scan…",
  processingLabel: "Processing emails",
  remainingSuffix: "remaining",
  doneLabel: "Done!",
  foundLabel: "Found so far",
  foundMetaSuffix: "/mo",
  subscriptionsLabel: "subscriptions",
  newBadge: "New",
  lookingLabel: "Looking for more…",
  failed: {
    title: "Scan failed",
    message:
      "We couldn't finish scanning your inbox. Your data is safe — nothing was stored.",
    retryCta: "Try again",
    skipCta: "Skip for now",
  },
} as const;

export const spendRevealContent = {
  step: 3,
  greetingSuffix: "here's the damage",
  fallbackGreeting: "Here's the damage",
  title: "You're spending this much on subscriptions",
  perYearLabel: "Total · per year",
  monthSuffix: "/month",
  subsSuffix: "active subscriptions",
  forgottenLabel: "Likely forgotten",
  foundLabel: "found",
  trialReason: "Trial — converts to paid",
  staleReason: "No charge seen in 45+ days",
  empty: {
    title: "No subscriptions found",
    message:
      "We didn't spot recurring charges in the last 6 months. You can add subscriptions manually anytime.",
  },
  cta: "Continue — Get alerts on Telegram",
} as const;

export const linkTelegramContent = {
  step: 4,
  title: "Get alerts on Telegram",
  subtitle: "3 days before every renewal. Free, unlimited.",
  bot: {
    handle: "@SubsnipBot",
    description: "Your subscription assistant",
    url: "https://t.me/SubsnipBot",
    verifiedBadge: "Verified",
  },
  sampleLabel: "Sample alert — this is what you'll see",
  sampleMessage:
    "🦥 Cure.fit renews tomorrow for ₹2,499. You haven't visited in 67 days.",
  sampleActions: ["Show me how to cancel", "Keep it"],
  cta: "Open Telegram and link",
  qr: {
    title: "On a different device?",
    description: "Scan this QR with your phone's camera to link Telegram.",
  },
  skip: "Skip — I'll use email alerts for now",
} as const;

export const profileSetupContent = {
  title: "Almost done",
  subtitle: "Just a few preferences and you're in.",
  aboutLabel: "About you",
  alertLabel: "Alert preferences",
  name: { label: "Display name", placeholder: "Your full name" },
  language: {
    label: "Preferred language",
    placeholder: "Select a language",
    options: [
      { value: "en", label: "English" },
      { value: "hi", label: "हिन्दी (Hindi)" },
      { value: "ta", label: "தமிழ் (Tamil)" },
      { value: "te", label: "తెలుగు (Telugu)" },
      { value: "bn", label: "বাংলা (Bengali)" },
      { value: "mr", label: "मराठी (Marathi)" },
    ],
  },
  alertTiming: {
    label: "Notify me before renewal",
    options: [
      { value: 1, label: "1 day" },
      { value: 3, label: "3 days" },
      { value: 7, label: "7 days" },
    ],
  },
  quietHours: {
    label: "Quiet hours (no alerts)",
    toLabel: "to",
    startLabel: "Quiet hours start",
    endLabel: "Quiet hours end",
    defaultStart: "22:00",
    defaultEnd: "07:00",
  },
  cta: "Finish setup",
  submittingCta: "Saving…",
} as const;
