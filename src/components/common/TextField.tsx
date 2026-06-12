"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  id: string;
  label: string;
  labelHidden?: boolean;
  leadingIcon?: React.ReactNode;
  error?: string;
}

export const TextField = ({
  id,
  label,
  labelHidden,
  leadingIcon,
  error,
  ...inputProps
}: TextFieldProps) => {
  const errorId = `${id}-error`;
  const isInvalid = Boolean(error);

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={id} className={labelHidden ? "sr-only" : undefined}>
        {label}
      </FieldLabel>
      <div className="relative">
        {leadingIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          >
            {leadingIcon}
          </span>
        )}
        <Input
          id={id}
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? errorId : undefined}
          className={cn(
            "h-12 rounded-xl bg-card px-3.5",
            leadingIcon && "pl-10",
          )}
          {...inputProps}
        />
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
};
