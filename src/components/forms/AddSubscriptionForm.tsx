"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { SelectField } from "@/components/common/SelectField";
import { TextField } from "@/components/common/TextField";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { dashboardContent } from "@/data/dashboard";
import { supabase } from "@/lib/supabase";
import {
  type AddSubscriptionFormValues,
  addSubscriptionSchema,
  type BillingCycle,
} from "@/lib/validations/subscription";

interface AddSubscriptionFormProps {
  onSuccess: () => void;
}

const content = dashboardContent.form;

export const AddSubscriptionForm = ({
  onSuccess,
}: AddSubscriptionFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddSubscriptionFormValues>({
    resolver: yupResolver(addSubscriptionSchema),
    mode: "onTouched",
    defaultValues: { billingCycle: "monthly", nextRenewalDate: "" },
  });

  const canSubmit = addSubscriptionSchema.isValidSync(watch());

  const onSubmit = async (values: AddSubscriptionFormValues) => {
    setServerError(null);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setServerError("Your session has expired. Please sign in again.");
      return;
    }
    // Manual entry: no catalog service, so service_id stays null and the name
    // lives in manual_name (per the subsnip-be subscriptions contract).
    const { error } = await supabase.from("subscriptions").insert({
      user_id: userData.user.id,
      service_id: null,
      manual_name: values.name,
      amount: values.amount,
      currency: "INR",
      amount_inr: values.amount,
      billing_cycle: values.billingCycle,
      next_renewal_date: values.nextRenewalDate || null,
      status: "active",
      detection_source: "manual",
      confidence_score: 1,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    onSuccess();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <TextField
        id="name"
        type="text"
        label={content.name.label}
        placeholder={content.name.placeholder}
        autoComplete="off"
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
      <TextField
        id="nextRenewalDate"
        type="date"
        label={content.nextRenewalDate.label}
        error={errors.nextRenewalDate?.message}
        {...register("nextRenewalDate")}
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
            {content.submittingCta}
          </>
        ) : (
          content.submitCta
        )}
      </Button>
    </form>
  );
};
