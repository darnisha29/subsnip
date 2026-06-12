import type { Metadata } from "next";

import { ScanPage } from "@/sections/ScanPage/ScanPage";

export const metadata: Metadata = {
  title: "Scanning your inbox · Subsnip",
  description: "Scanning your inbox for recurring charges.",
};

const Scan = () => {
  return <ScanPage />;
};

export default Scan;
