import { redirect } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────
// DISABLED FOR NOW — the post-scan spend reveal is parked (it depends on the
// Gmail scan). Feature preserved in
// src/sections/SpendRevealPage/SpendRevealPage.tsx.
// To re-enable: restore the body below and re-add to the flow + proxy.
//
// import type { Metadata } from "next";
// import { SpendRevealPage } from "@/sections/SpendRevealPage/SpendRevealPage";
//
// export const metadata: Metadata = {
//   title: "Your subscription spend · Subsnip",
//   description: "See what your subscriptions really cost you per year.",
// };
//
// const SpendReveal = () => {
//   return <SpendRevealPage />;
// };
// ─────────────────────────────────────────────────────────────────────────

// Dynamic so redirect() issues an immediate 307 instead of a static
// meta-refresh.
export const dynamic = "force-dynamic";

const SpendReveal = () => {
  redirect("/dashboard");
};

export default SpendReveal;
