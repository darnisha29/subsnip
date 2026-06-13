"use client";

import { ArrowUpDown, Folder, LayoutGrid, List } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dashboardContent } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import type {
  FilterKey,
  SortKey,
  ViewMode,
} from "@/utils/subscriptionFilters";

const ALL_CATEGORIES = "__all__";

interface SubscriptionToolbarProps {
  filter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  counts: { all: number; renewing: number; trials: number };
  categories: string[];
  category: string | null;
  onCategoryChange: (category: string | null) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const { filters, sort: sortCopy, view: viewCopy } = dashboardContent;

interface FilterPillProps {
  active: boolean;
  label: string;
  count: number;
  dotClass?: string;
  onClick: () => void;
}

const FilterPill = ({
  active,
  label,
  count,
  dotClass,
  onClick,
}: FilterPillProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors",
      active
        ? "bg-foreground text-background"
        : "bg-card text-foreground ring-1 ring-border hover:bg-muted",
    )}
  >
    {dotClass && (
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", dotClass)}
      />
    )}
    {label}
    <Typography
      as="span"
      variant="inherit"
      className={cn(
        "font-semibold tabular-nums",
        active ? "text-background/70" : "text-tertiary",
      )}
    >
      {count}
    </Typography>
  </button>
);

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "renewal", label: sortCopy.renewal },
  { value: "name", label: sortCopy.name },
  { value: "amount", label: sortCopy.amount },
];

export const SubscriptionToolbar = ({
  filter,
  onFilterChange,
  counts,
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: SubscriptionToolbarProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill
          active={filter === "all"}
          label={filters.all}
          count={counts.all}
          onClick={() => onFilterChange("all")}
        />
        <FilterPill
          active={filter === "renewing"}
          label={filters.renewing}
          count={counts.renewing}
          dotClass="bg-destructive"
          onClick={() => onFilterChange("renewing")}
        />
        <FilterPill
          active={filter === "trials"}
          label={filters.trials}
          count={counts.trials}
          dotClass="bg-success"
          onClick={() => onFilterChange("trials")}
        />
        {categories.length > 0 && (
          <Select
            value={category ?? ALL_CATEGORIES}
            onValueChange={(value) =>
              onCategoryChange(value === ALL_CATEGORIES ? null : value)
            }
          >
            <SelectTrigger
              aria-label={filters.categoryLabel}
              className="h-9 rounded-full bg-card px-3.5"
            >
              <Folder aria-hidden="true" className="size-4 text-tertiary" />
              <SelectValue placeholder={filters.categoryLabel} />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectItem value={ALL_CATEGORIES}>
                {filters.categoryAll}
              </SelectItem>
              {categories.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select value={sort} onValueChange={(value) => onSortChange(value as SortKey)}>
          <SelectTrigger
            aria-label={sortCopy.label}
            className="h-9 rounded-full bg-card px-3.5"
          >
            <ArrowUpDown aria-hidden="true" className="size-4 text-tertiary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 rounded-full bg-card p-1 ring-1 ring-border">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={viewCopy.grid}
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
            className={cn(
              "rounded-full",
              view === "grid" && "bg-secondary text-secondary-foreground",
            )}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={viewCopy.list}
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
            className={cn(
              "rounded-full",
              view === "list" && "bg-secondary text-secondary-foreground",
            )}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
