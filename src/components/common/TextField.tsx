"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  id: string;
  label: string;
  error?: string;
}

export const TextField = ({
  id,
  label,
  error,
  ...inputProps
}: TextFieldProps) => {
  const errorId = `${id}-error`;
  const isInvalid = Boolean(error);

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        aria-invalid={isInvalid || undefined}
        aria-describedby={isInvalid ? errorId : undefined}
        className="h-12 rounded-xl bg-card px-3.5"
        {...inputProps}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
};
