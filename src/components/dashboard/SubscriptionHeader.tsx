"use client";

import { Plus } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { dashboardContent } from "@/data/dashboard";
import { formatINR } from "@/utils/formatCurrency";

interface SubscriptionHeaderProps {
  activeCount: number;
  monthlyOutflow: number;
  onAddClick: () => void;
}

export const SubscriptionHeader = ({
  activeCount,
  monthlyOutflow,
  onAddClick,
}: SubscriptionHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <Typography variant="h1">{dashboardContent.title}</Typography>
          <Typography
            as="span"
            variant="inherit"
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground tabular-nums"
          >
            {activeCount} {dashboardContent.activeSuffix}
          </Typography>
        </div>
        <Typography variant="small">
          {formatINR(monthlyOutflow)} {dashboardContent.outflowSuffix}
        </Typography>
      </div>

      <Button
        onClick={onAddClick}
        className="h-10 rounded-full text-sm font-semibold"
      >
        <Plus aria-hidden="true" className="size-4" />
        {dashboardContent.addCta}
      </Button>
    </div>
  );
};
