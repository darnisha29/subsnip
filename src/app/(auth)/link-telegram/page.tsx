import { redirect } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────
// DISABLED FOR NOW — Telegram linking is parked. Feature preserved in
// src/sections/LinkTelegramPage/LinkTelegramPage.tsx.
// To re-enable: restore the body below and re-add to the flow + proxy.
//
// import type { Metadata } from "next";
// import { LinkTelegramPage } from "@/sections/LinkTelegramPage/LinkTelegramPage";
//
// export const metadata: Metadata = {
//   title: "Get alerts on Telegram · Subsnip",
//   description: "Link Telegram to get renewal alerts before every charge.",
// };
//
// const LinkTelegram = () => {
//   return <LinkTelegramPage />;
// };
// ─────────────────────────────────────────────────────────────────────────

// Dynamic so redirect() issues an immediate 307 instead of a static
// meta-refresh.
export const dynamic = "force-dynamic";

const LinkTelegram = () => {
  redirect("/dashboard");
};

export default LinkTelegram;
