"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, type DefaultValues, useForm } from "react-hook-form";

import { SelectField } from "@/components/common/SelectField";
import { TextField } from "@/components/common/TextField";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { dashboardContent } from "@/data/dashboard";
import {
  type BillingCycle,
  type SubscriptionFormValues,
  subscriptionSchema,
} from "@/lib/validations/subscription";

interface SubscriptionFormProps {
  defaultValues: DefaultValues<SubscriptionFormValues>;
  nameEditable?: boolean;
  submitCta: string;
  submittingCta: string;
  onSubmit: (values: SubscriptionFormValues) => Promise<{ error?: string }>;
}

const content = dashboardContent.form;

export const SubscriptionForm = ({
  defaultValues,
  nameEditable = true,
  submitCta,
  submittingCta,
  onSubmit,
}: SubscriptionFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormValues>({
    resolver: yupResolver(subscriptionSchema),
    mode: "onTouched",
    defaultValues,
  });

  const canSubmit = subscriptionSchema.isValidSync(watch());

  const submit = async (values: SubscriptionFormValues) => {
    setServerError(null);
    const result = await onSubmit(values);
    if (result.error) {
      setServerError(result.error);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-5"
    >
      <TextField
        id="name"
        type="text"
        label={content.name.label}
        placeholder={content.name.placeholder}
        autoComplete="off"
        disabled={!nameEditable}
        error={errors.name?.message}
        {...register("name")}
      />
      <TextField
        id="amount"
        type="number"
        inputMode="numeric"
        label={content.amount.label}
        placeholder={content.amount.placeholder}
        error={errors.amount?.message}
        {...register("amount", { valueAsNumber: true })}
      />
      <Controller
        control={control}
        name="billingCycle"
        render={({ field }) => (
          <SelectField
            id="billingCycle"
            label={content.billingCycle.label}
            placeholder={content.billingCycle.placeholder}
            options={content.billingCycle.options}
            value={field.value}
            onChange={(value) => field.onChange(value as BillingCycle)}
            error={errors.billingCycle?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <SelectField
            id="category"
            label={content.category.label}
            placeholder={content.category.placeholder}
            options={content.category.options}
            value={field.value || undefined}
            onChange={field.onChange}
            error={errors.category?.message}
          />
        )}
      />
      <TextField
        id="nextRenewalDate"
        type="date"
        label={content.nextRenewalDate.label}
        error={errors.nextRenewalDate?.message}
        {...register("nextRenewalDate")}
      />

      <Controller
        control={control}
        name="isTrial"
        render={({ field }) => (
          <label
            htmlFor="isTrial"
            className="flex cursor-pointer items-center gap-2.5"
          >
            <Checkbox
              id="isTrial"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <Typography as="span" variant="small" className="text-foreground">
              {content.trial.label}
            </Typography>
          </label>
        )}
      />

      {serverError && (
        <Typography variant="error" role="alert">
          {serverError}
        </Typography>
      )}

      <Button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        aria-busy={isSubmitting}
        className="h-12 w-full rounded-full text-sm font-semibold"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            {submittingCta}
          </>
        ) : (
          submitCta
        )}
      </Button>
    </form>
  );
};
