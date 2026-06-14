"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { dashboardContent } from "@/data/dashboard";

interface CalendarNavProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const copy = dashboardContent.calendar;

export const CalendarNav = ({
  label,
  onPrev,
  onNext,
  onToday,
}: CalendarNavProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onToday}
        className="h-9 rounded-full bg-card px-4 text-sm font-medium"
      >
        {copy.today}
      </Button>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={copy.prev}
          onClick={onPrev}
          className="size-9 rounded-full bg-card"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={copy.next}
          onClick={onNext}
          className="size-9 rounded-full bg-card"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <Typography variant="h4" className="ml-1 whitespace-nowrap">
        {label}
      </Typography>
    </div>
  );
};
