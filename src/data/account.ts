export const accountContent = {
  title: "Account",
  connectedLabel: "Connected accounts",
  connections: [
    {
      key: "gmail",
      name: "Gmail",
      status: "Connected · scanning daily",
      action: "Revoke",
    },
    {
      key: "telegram",
      name: "Telegram",
      status: "@khushi_p · alerts on",
      action: "Unlink",
    },
  ],
  preferencesLabel: "Preferences",
  preferences: [
    { label: "Language", value: "English" },
    { label: "Alert timing", value: "3 days" },
    { label: "Quiet hours", value: "10pm – 7am" },
  ],
  signOutCta: "Sign out",
  deleteCta: "Delete account permanently",
  deleteDialog: {
    title: "Delete your account?",
    description:
      "This permanently erases your profile, scanned subscriptions, and alert history. This cannot be undone.",
    cancel: "Keep my account",
    confirm: "Yes, delete everything",
  },
} as const;
