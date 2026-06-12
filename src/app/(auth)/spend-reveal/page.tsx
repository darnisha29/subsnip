import type { Metadata } from "next";

import { SpendRevealPage } from "@/sections/SpendRevealPage/SpendRevealPage";

export const metadata: Metadata = {
  title: "Your subscription spend · Subsnip",
  description: "See what your subscriptions really cost you per year.",
};

const SpendReveal = () => {
  return <SpendRevealPage />;
};

export default SpendReveal;
