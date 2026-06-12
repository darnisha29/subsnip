"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface PasswordFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type"
> {
  id: string;
  label: string;
  error?: string;
}

export const PasswordField = ({
  id,
  label,
  error,
  ...inputProps
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const errorId = `${id}-error`;
  const isInvalid = Boolean(error);

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? errorId : undefined}
          className="h-12 rounded-xl bg-card px-3.5 pr-11"
          {...inputProps}
        />
        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          onClick={() => setIsVisible((previous) => !previous)}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {isVisible ? (
            <EyeOff className="size-4.5" aria-hidden="true" />
          ) : (
            <Eye className="size-4.5" aria-hidden="true" />
          )}
        </button>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
};
