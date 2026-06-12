import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { signUpShowcase } from "@/data/auth";

const trustIcons: Record<string, React.ElementType> = {
  shield: ShieldCheck,
  lock: LockKeyhole,
  check: BadgeCheck,
};

export const TrustBadges = () => {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
      {signUpShowcase.trust.map((item) => {
        const Icon = trustIcons[item.icon] ?? ShieldCheck;
        return (
          <li key={item.label} className="flex items-center gap-1.5">
            <Icon aria-hidden="true" className="size-4 text-success" />
            <Typography
              as="span"
              variant="caption"
              className="font-medium text-muted-foreground"
            >
              {item.label}
            </Typography>
          </li>
        );
      })}
    </ul>
  );
};
