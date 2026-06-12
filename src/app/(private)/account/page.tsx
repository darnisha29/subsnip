import type { Metadata } from "next";

import { AccountPage } from "@/sections/AccountPage/AccountPage";

export const metadata: Metadata = {
  title: "Account · Subsnip",
  description: "Manage your Subsnip account, connections, and preferences.",
};

const Account = () => {
  return <AccountPage />;
};

export default Account;
