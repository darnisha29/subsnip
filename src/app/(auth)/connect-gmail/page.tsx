import type { Metadata } from "next";

import { ConnectGmailPage } from "@/sections/ConnectGmailPage/ConnectGmailPage";

export const metadata: Metadata = {
  title: "Connect Gmail · Subsnip",
  description: "Find your forgotten subscriptions with a read-only Gmail scan.",
};

const ConnectGmail = () => {
  return <ConnectGmailPage />;
};

export default ConnectGmail;
