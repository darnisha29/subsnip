import type { Metadata } from "next";

import { ConnectGmailPage } from "@/sections/ConnectGmailPage/ConnectGmailPage";

export const metadata: Metadata = {
  title: "Connect Gmail · Subsnip",
  description: "Find your forgotten subscriptions with a read-only Gmail scan.",
};

const ConnectGmail = async ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) => {
  const { error } = await searchParams;
  return <ConnectGmailPage hasError={error === "gmail_connect_failed"} />;
};

export default ConnectGmail;
