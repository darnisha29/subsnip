import { Send } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { Card, CardContent } from "@/components/ui/card";
import { signUpShowcase } from "@/data/auth";

const { alert } = signUpShowcase;

export const TelegramAlertCard = () => {
  return (
    <Card className="gap-0 py-0 shadow-[0_8px_30px_rgba(42,171,238,0.08)] ring-border">
      <CardContent className="flex items-start gap-3 p-4 sm:p-5">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-telegram text-white"
        >
          <Send className="size-4" />
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Typography
              as="span"
              variant="small"
              className="font-semibold text-foreground"
            >
              {alert.sender}
            </Typography>
            <Typography
              as="span"
              variant="caption"
              className="rounded-full bg-pill px-2 py-0.5 font-semibold tracking-wide whitespace-nowrap text-pill-foreground uppercase"
            >
              {alert.badge}
            </Typography>
          </div>
          <Typography variant="small" className="leading-6">
            {alert.message}{" "}
            <Typography
              as="span"
              variant="small"
              className="font-medium text-primary"
            >
              {alert.linkText}
            </Typography>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
