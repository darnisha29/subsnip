import type { Metadata } from "next";

import { ProfileSetupPage } from "@/sections/ProfileSetupPage/ProfileSetupPage";

export const metadata: Metadata = {
  title: "Profile setup · Subsnip",
  description: "A few quick preferences and you're in.",
};

const ProfileSetup = () => {
  return <ProfileSetupPage />;
};

export default ProfileSetup;
