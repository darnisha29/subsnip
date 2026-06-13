"use client";

import { Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardContent } from "@/data/dashboard";
import type { Database } from "@/types/supabase";
import { formatINR } from "@/utils/formatCurrency";
import { formatDateShort } from "@/utils/formatDate";

type BillingCycle = Database["public"]["Enums"]["billing_cycle"];

const CYCLE_SUFFIX: Record<BillingCycle, string> = {
  weekly: "/wk",
  monthly: "/mo",
  quarterly: "/qtr",
  semi_annual: "/6mo",
  annual: "/yr",
  lifetime: "",
  unknown: "/mo",
};

interface SubscriptionCardProps {
  name: string;
  amountInr: number;
  billingCycle: BillingCycle;
  nextRenewalDate: string | null;
  onDelete: () => void;
}

export const SubscriptionCard = ({
  name,
  amountInr,
  billingCycle,
  nextRenewalDate,
  onDelete,
}: SubscriptionCardProps) => {
  return (
    <Card className="gap-0 py-0 ring-border">
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Typography
            as="span"
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
          >
            {name.charAt(0).toUpperCase()}
          </Typography>
          <div className="flex min-w-0 flex-col">
            <Typography
              as="span"
              variant="body"
              className="truncate font-semibold"
            >
              {name}
            </Typography>
            <Typography as="span" variant="small">
              {nextRenewalDate
                ? `${dashboardContent.list.renewsLabel} ${formatDateShort(nextRenewalDate)}`
                : dashboardContent.list.noRenewal}
            </Typography>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Typography
            as="span"
            variant="body"
            className="font-semibold whitespace-nowrap"
          >
            {formatINR(amountInr)}
            <Typography variant="inherit" className="text-tertiary">
              {CYCLE_SUFFIX[billingCycle]}
            </Typography>
          </Typography>
          <ConfirmDialog
            destructive
            title={dashboardContent.deleteDialog.title}
            description={dashboardContent.deleteDialog.description}
            cancelLabel={dashboardContent.deleteDialog.cancel}
            confirmLabel={dashboardContent.deleteDialog.confirm}
            onConfirm={onDelete}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${name}`}
                className="text-tertiary hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
