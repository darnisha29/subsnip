import type { Metadata } from "next";

import { DashboardPage } from "@/sections/DashboardPage/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard · Subsnip",
  description: "Track your subscriptions and what they cost you.",
};

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;
