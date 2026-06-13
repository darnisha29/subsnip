import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";
import { formatINR } from "@/utils/formatCurrency";

interface SubscriptionGroupHeaderProps {
  label: string;
  count: number;
  total?: number;
  accent?: boolean;
  className?: string;
}

// Section heading used above each group of cards/rows: label, a count chip and
// an optional charge total on the right.
export const SubscriptionGroupHeader = ({
  label,
  count,
  total,
  accent,
  className,
}: SubscriptionGroupHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2">
        <Typography
          as="span"
          variant="caption"
          className={cn(
            "font-semibold tracking-wider uppercase",
            accent ? "text-destructive" : "text-tertiary",
          )}
        >
          {label}
        </Typography>
        <Typography
          as="span"
          variant="inherit"
          className="rounded-full bg-muted px-1.5 text-[0.6875rem] font-semibold text-muted-foreground tabular-nums"
        >
          {count}
        </Typography>
      </div>
      {total !== undefined && (
        <Typography
          as="span"
          variant="small"
          className="font-medium tabular-nums"
        >
          {formatINR(total)}
        </Typography>
      )}
    </div>
  );
};
