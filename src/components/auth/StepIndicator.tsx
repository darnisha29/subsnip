import { SquareCheck } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 4;

interface StepIndicatorProps {
  current: number | "final";
}

// 4-segment wizard progress for the onboarding app bar. "final" fills all
// segments and shows a green check with "Final touches".
export const StepIndicator = ({ current }: StepIndicatorProps) => {
  const isFinal = current === "final";

  return (
    <div className="flex items-center gap-3">
      <div aria-hidden="true" className="flex items-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-0.75 w-7 rounded-xs transition-colors",
              isFinal || index < (current as number)
                ? "bg-primary"
                : "bg-secondary",
            )}
          />
        ))}
        {isFinal && <SquareCheck className="size-4 text-success" />}
      </div>
      <Typography as="span" variant="caption" className="whitespace-nowrap">
        {isFinal ? "Final touches" : `Step ${current} of ${TOTAL_STEPS}`}
      </Typography>
    </div>
  );
};
