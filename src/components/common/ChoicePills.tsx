"use client";

import { Typography } from "@/components/common/Typography";
import { Field, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface ChoicePillOption<T extends string | number> {
  value: T;
  label: string;
}

interface ChoicePillsProps<T extends string | number> {
  label: string;
  options: ReadonlyArray<ChoicePillOption<T>>;
  value: T | undefined;
  onChange: (value: T) => void;
  error?: string;
}

export const ChoicePills = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  error,
}: ChoicePillsProps<T>) => {
  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <Typography
        as="span"
        variant="small"
        className="font-medium text-foreground"
      >
        {label}
      </Typography>
      <div role="group" aria-label={label} className="flex gap-2">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-11 flex-1 rounded-lg border text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isSelected
                  ? "border-[1.5px] border-primary bg-pill font-semibold text-pill-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <FieldError>{error}</FieldError>
    </Field>
  );
};
