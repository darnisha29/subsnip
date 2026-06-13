import { redirect } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────
// DISABLED FOR NOW — the on-device Gmail scan is parked. Feature preserved in
// src/sections/ScanPage/ScanPage.tsx and src/lib/gmail/scanner.ts.
// To re-enable: restore the body below and re-add to the flow + proxy.
//
// import type { Metadata } from "next";
// import { ScanPage } from "@/sections/ScanPage/ScanPage";
//
// export const metadata: Metadata = {
//   title: "Scanning your inbox · Subsnip",
//   description: "Scanning your inbox for recurring charges.",
// };
//
// const Scan = () => {
//   return <ScanPage />;
// };
// ─────────────────────────────────────────────────────────────────────────

// Dynamic so redirect() issues an immediate 307 instead of a static
// meta-refresh.
export const dynamic = "force-dynamic";

const Scan = () => {
  redirect("/dashboard");
};

export default Scan;
