"use client";

import { Typography } from "@/components/common/Typography";
import { dashboardContent } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import type { CalendarCell } from "@/utils/calendar";
import { formatINR } from "@/utils/formatCurrency";
import {
  type DisplaySubscription,
  type RenewalStatus,
  renewalStatus,
} from "@/utils/subscriptionFilters";

const STATUS_STYLE: Record<RenewalStatus, { dot: string; chip: string; text: string }> = {
  urgent: { dot: "bg-destructive", chip: "bg-destructive/10", text: "text-destructive" },
  week: { dot: "bg-warning", chip: "bg-warning-tint", text: "text-foreground" },
  trial: { dot: "bg-success", chip: "bg-success-tint", text: "text-foreground" },
  upcoming: { dot: "bg-primary", chip: "bg-secondary", text: "text-foreground" },
};

const copy = dashboardContent.calendar;

interface CalendarGridProps {
  matrix: CalendarCell[][];
  byDate: Map<string, DisplaySubscription[]>;
  maxChips: number;
  onSelect: (subscription: DisplaySubscription) => void;
}

interface DayCellProps {
  cell: CalendarCell;
  items: DisplaySubscription[];
  maxChips: number;
  onSelect: (subscription: DisplaySubscription) => void;
}

const DayCell = ({ cell, items, maxChips, onSelect }: DayCellProps) => {
  const total = items.reduce((sum, item) => sum + Number(item.amount_inr), 0);
  const hasUrgent = items.some((item) => renewalStatus(item) === "urgent");
  const overflow = items.length - maxChips;

  return (
    <div
      className={cn(
        "flex min-h-24 flex-col gap-1 bg-card p-2",
        !cell.inMonth && "bg-muted/30",
        hasUrgent && "bg-destructive/5",
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <Typography
          as="span"
          variant="inherit"
          className={cn(
            "flex size-6 items-center justify-center text-sm tabular-nums",
            !cell.inMonth && "text-tertiary",
            hasUrgent && "font-semibold text-destructive",
            cell.isToday &&
              "rounded-full bg-foreground font-semibold text-background",
          )}
        >
          {cell.date.getDate()}
        </Typography>
        {total > 0 && (
          <Typography
            as="span"
            variant="inherit"
            className={cn(
              "text-[0.6875rem] font-semibold tabular-nums",
              hasUrgent ? "text-destructive" : "text-foreground",
            )}
          >
            {formatINR(total)}
          </Typography>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {items.slice(0, maxChips).map((item) => {
          const status = renewalStatus(item);
          const style = STATUS_STYLE[status];
          const isTrial = status === "trial";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              title={isTrial ? `${item.displayName} (trial)` : item.displayName}
              className={cn(
                "flex w-full items-center gap-1 rounded px-1.5 py-0.5 text-left transition-opacity hover:opacity-80",
                style.chip,
              )}
            >
              <span
                aria-hidden="true"
                className={cn("size-1.5 shrink-0 rounded-full", style.dot)}
              />
              <Typography
                as="span"
                variant="inherit"
                className={cn(
                  "min-w-0 flex-1 truncate text-[0.6875rem] font-medium",
                  style.text,
                )}
              >
                {item.displayName}
              </Typography>
              {isTrial && (
                <Typography
                  as="span"
                  variant="inherit"
                  className="shrink-0 text-[0.625rem] font-semibold text-success"
                >
                  trial
                </Typography>
              )}
            </button>
          );
        })}
        {overflow > 0 && (
          <Typography as="span" variant="caption" className="pl-1.5">
            +{overflow} {copy.more}
          </Typography>
        )}
      </div>
    </div>
  );
};

export const CalendarGrid = ({
  matrix,
  byDate,
  maxChips,
  onSelect,
}: CalendarGridProps) => {
  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-border ring-1 ring-border">
      {copy.weekdays.map((weekday) => (
        <Typography
          key={weekday}
          as="span"
          variant="caption"
          className="bg-card px-2 py-2.5 text-center font-semibold tracking-wider uppercase"
        >
          {weekday}
        </Typography>
      ))}
      {matrix.flat().map((cell) => (
        <DayCell
          key={cell.iso}
          cell={cell}
          items={byDate.get(cell.iso) ?? []}
          maxChips={maxChips}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
