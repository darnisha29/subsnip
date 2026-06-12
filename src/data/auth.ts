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

export const signInContent = {
  title: "Sign in",
  subtitle: "Use the method you signed up with.",
  googleCta: "Continue with Google",
  divider: "or with email",
  email: {
    label: "Email",
    placeholder: "you@email.com",
  },
  password: {
    label: "Password",
    placeholder: "Your password",
  },
  forgotPassword: "Forgot password?",
  submitCta: "Sign in",
  submittingCta: "Signing in…",
  signUpPrompt: "New here?",
  signUpCta: "Create account",
} as const;

export const signInShowcase = {
  headlineLines: ["Welcome back.", "Your subs missed you."],
  subheadline:
    "Sign in to see what's renewing this week and how much you've saved by cancelling the ones you didn't use.",
  savedLabel: "Your total saved · so far",
  savedAmount: 47800,
  savedMeta: "3 subs cancelled this month",
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
