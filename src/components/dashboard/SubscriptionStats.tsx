import { Typography } from "@/components/common/Typography";
import { Card } from "@/components/ui/card";
import { dashboardContent } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { formatINR } from "@/utils/formatCurrency";

interface SubscriptionStatsProps {
  monthly: number;
  annual: number;
  thisWeekTotal: number;
  thisWeekCount: number;
  trialsCount: number;
  activeCount: number;
}

const stats = dashboardContent.stats;

const fill = (template: string, count: number) =>
  template.replace("{count}", String(count));

interface StatCellProps {
  label: string;
  value: string;
  caption: string;
}

const StatCell = ({ label, value, caption }: StatCellProps) => (
  <div className="flex flex-col gap-1 px-4 py-4 sm:px-5">
    <Typography
      as="span"
      variant="caption"
      className="font-semibold tracking-wider uppercase"
    >
      {label}
    </Typography>
    <Typography
      as="span"
      className="text-xl font-bold tracking-tight tabular-nums"
    >
      {value}
    </Typography>
    <Typography as="span" variant="small">
      {caption}
    </Typography>
  </div>
);

export const SubscriptionStats = ({
  monthly,
  annual,
  thisWeekTotal,
  thisWeekCount,
  trialsCount,
  activeCount,
}: SubscriptionStatsProps) => {
  const cells: StatCellProps[] = [
    {
      label: stats.monthly.label,
      value: formatINR(monthly),
      caption: fill(stats.monthly.caption, activeCount),
    },
    {
      label: stats.annual.label,
      value: formatINR(annual),
      caption: stats.annual.caption,
    },
    {
      label: stats.thisWeek.label,
      value: formatINR(thisWeekTotal),
      caption: fill(stats.thisWeek.caption, thisWeekCount),
    },
    {
      label: stats.trials.label,
      value: String(trialsCount),
      caption: stats.trials.caption,
    },
  ];

  return (
    <Card className="grid grid-cols-2 gap-0 py-0 ring-border sm:grid-cols-4">
      {cells.map((cell, index) => (
        <div
          key={cell.label}
          className={cn(
            "border-border",
            index % 2 === 1 && "border-l",
            index >= 2 && "border-t sm:border-t-0",
            index >= 1 && "sm:border-l",
          )}
        >
          <StatCell {...cell} />
        </div>
      ))}
    </Card>
  );
};
