"use client";

import { Typography } from "@/components/common/Typography";
import { SubscriptionAvatar } from "@/components/dashboard/SubscriptionAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardContent } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { isInMonth, monthName } from "@/utils/calendar";
import { formatINR } from "@/utils/formatCurrency";
import { daysUntil, renewalPhrase } from "@/utils/formatDate";
import {
  type DisplaySubscription,
  type RenewalStatus,
  isTrialRow,
  renewalStatus,
} from "@/utils/subscriptionFilters";
import { renewingSoon } from "@/utils/subscriptionMath";

const copy = dashboardContent.calendar;

const STATUS_TEXT: Record<RenewalStatus, string> = {
  urgent: "text-destructive",
  week: "text-warning",
  trial: "text-success",
  upcoming: "text-tertiary",
};

const LEGEND: { key: RenewalStatus; swatch: string }[] = [
  { key: "urgent", swatch: "bg-destructive" },
  { key: "week", swatch: "bg-warning" },
  { key: "upcoming", swatch: "bg-primary" },
  { key: "trial", swatch: "bg-success" },
];

interface CalendarSidebarProps {
  subscriptions: DisplaySubscription[];
  anchor: Date;
  onSelect: (subscription: DisplaySubscription) => void;
}

const Row = ({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between gap-3">
    <Typography as="span" variant="small">
      {label}
    </Typography>
    <Typography
      as="span"
      variant="inherit"
      className={cn("text-sm font-semibold tabular-nums", valueClass)}
    >
      {value}
    </Typography>
  </div>
);

export const CalendarSidebar = ({
  subscriptions,
  anchor,
  onSelect,
}: CalendarSidebarProps) => {
  const monthSubs = subscriptions.filter(
    (item) => item.next_renewal_date && isInMonth(item.next_renewal_date, anchor),
  );
  const totalSpend = Math.round(
    monthSubs.reduce((sum, item) => sum + Number(item.amount_inr), 0),
  );
  const comingUp = renewingSoon(subscriptions).length;
  const trialsEnding = monthSubs.filter(isTrialRow).length;

  const upNext = subscriptions
    .filter(
      (item) =>
        item.next_renewal_date && daysUntil(item.next_renewal_date) >= 0,
    )
    .sort((a, b) =>
      (a.next_renewal_date ?? "").localeCompare(b.next_renewal_date ?? ""),
    )
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-0 py-0 ring-border">
        <CardContent className="flex flex-col gap-4 p-5">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {monthName(anchor)} {copy.overviewSuffix}
          </Typography>
          <div className="flex flex-col gap-0.5">
            <Typography as="span" variant="small">
              {copy.totalSpend}
            </Typography>
            <Typography
              as="span"
              className="text-3xl font-bold tracking-tight tabular-nums"
            >
              {formatINR(totalSpend)}
            </Typography>
          </div>
          <div className="flex flex-col gap-2.5 border-t border-border pt-3.5">
            <Row label={copy.renewals} value={String(monthSubs.length)} />
            <Row
              label={copy.comingUp}
              value={String(comingUp)}
              valueClass="text-destructive"
            />
            <Row
              label={copy.trialsEnding}
              value={String(trialsEnding)}
              valueClass="text-success"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 ring-border">
        <CardContent className="flex flex-col gap-3 p-5">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {copy.legendTitle}
          </Typography>
          {LEGEND.map((entry) => (
            <div key={entry.key} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={cn("size-2.5 rounded-sm", entry.swatch)}
              />
              <Typography as="span" variant="small" className="text-foreground">
                {copy.legend[entry.key]}
              </Typography>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 ring-border">
        <CardContent className="flex flex-col gap-3 p-5">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {copy.upNextTitle}
          </Typography>
          {upNext.length === 0 ? (
            <Typography variant="small">{copy.upNextEmpty}</Typography>
          ) : (
            upNext.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className="-mx-1 flex items-center gap-3 rounded-lg px-1 py-1 text-left transition-colors hover:bg-muted/50"
              >
                <SubscriptionAvatar name={item.displayName} className="size-9" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Typography
                    as="span"
                    variant="body"
                    className="truncate text-sm font-semibold"
                  >
                    {item.displayName}
                  </Typography>
                  <Typography
                    as="span"
                    variant="inherit"
                    className={cn(
                      "text-xs font-medium",
                      STATUS_TEXT[renewalStatus(item)],
                    )}
                  >
                    {item.next_renewal_date &&
                      renewalPhrase(item.next_renewal_date)}
                  </Typography>
                </div>
                <Typography
                  as="span"
                  variant="body"
                  className="text-sm font-semibold whitespace-nowrap tabular-nums"
                >
                  {formatINR(Number(item.amount_inr))}
                </Typography>
              </button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
