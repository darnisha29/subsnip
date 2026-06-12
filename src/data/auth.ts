export const signUpContent = {
  title: "Create your account",
  subtitle: "Free forever. No credit card needed.",
  googleCta: "Continue with Google",
  divider: "or with email",
  email: {
    label: "Email",
    placeholder: "you@email.com",
  },
  password: {
    label: "Password",
    placeholder: "At least 8 characters",
  },
  submitCta: "Create account",
  submittingCta: "Creating account…",
  terms: {
    prefix: "By creating an account you agree to our",
    termsLabel: "Terms",
    termsHref: "/terms",
    conjunction: "and",
    privacyLabel: "Privacy Policy",
    privacyHref: "/privacy",
  },
  successMessage:
    "Account created. Check your inbox to confirm your email address.",
  signInPrompt: "Already have an account?",
  signInCta: "Sign in",
} as const;

export const signUpShowcase = {
  headline: "Stop paying for subscriptions you forgot you had.",
  subheadline:
    "We scan your Gmail in 60 seconds, find every recurring charge, and ping you on Telegram 3 days before each renewal.",
  preview: {
    spendLabel: "Your hidden yearly spend",
    spendAmount: 177840,
    spendMeta: "12 subs · ₹14,820/mo",
    subscriptions: [
      { name: "Netflix", amount: "₹649" },
      { name: "ChatGPT Plus", amount: "₹1,750" },
      { name: "Adobe Creative Cloud", amount: "₹4,232" },
    ],
    moreLabel: "+9 more",
  },
  alert: {
    sender: "@SubsnipBot",
    badge: "Sample alert",
    message: "Cure.fit renews tomorrow for ₹2,499 —",
    linkText: "cancel now?",
  },
  trust: [
    { icon: "shield", label: "Read-only Gmail" },
    { icon: "lock", label: "Emails never stored" },
    { icon: "check", label: "Cancel anytime" },
  ],
} as const;
