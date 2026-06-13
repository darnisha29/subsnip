import { redirect } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────
// DISABLED FOR NOW — Gmail connect is parked until the email-scan flow is
// re-enabled. The full feature is preserved in:
//   • src/sections/ConnectGmailPage/ConnectGmailPage.tsx
//   • src/lib/gmail/*  and  src/app/api/gmail/*
// To re-enable: restore the body below and add the route back to the
// onboarding flow + proxy PROTECTED_PATHS.
//
// import type { Metadata } from "next";
// import { ConnectGmailPage } from "@/sections/ConnectGmailPage/ConnectGmailPage";
//
// export const metadata: Metadata = {
//   title: "Connect Gmail · Subsnip",
//   description: "Find your forgotten subscriptions with a read-only Gmail scan.",
// };
//
// const ConnectGmail = async ({
//   searchParams,
// }: {
//   searchParams: Promise<{ error?: string }>;
// }) => {
//   const { error } = await searchParams;
//   return <ConnectGmailPage hasError={error === "gmail_connect_failed"} />;
// };
// ─────────────────────────────────────────────────────────────────────────

// Dynamic so redirect() issues an immediate 307 instead of a static
// meta-refresh.
export const dynamic = "force-dynamic";

const ConnectGmail = () => {
  redirect("/dashboard");
};

export default ConnectGmail;
