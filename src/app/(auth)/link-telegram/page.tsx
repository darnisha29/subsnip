import type { Metadata } from "next";

import { LinkTelegramPage } from "@/sections/LinkTelegramPage/LinkTelegramPage";

export const metadata: Metadata = {
  title: "Get alerts on Telegram · Subsnip",
  description: "Link Telegram to get renewal alerts before every charge.",
};

const LinkTelegram = () => {
  return <LinkTelegramPage />;
};

export default LinkTelegram;
