"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/common/TextField";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { forgotPasswordContent } from "@/data/auth";
import { supabase } from "@/lib/supabase";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/lib/validations/auth";

export const ForgotPasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  // Live validity for the disabled state without surfacing errors early.
  const canSubmit = forgotPasswordSchema.isValidSync(watch());

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    setIsSuccess(false);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    setIsSuccess(true);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <TextField
        id="email"
        type="email"
        label={forgotPasswordContent.email.label}
        placeholder={forgotPasswordContent.email.placeholder}
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {serverError && (
        <Typography variant="error" role="alert">
          {serverError}
        </Typography>
      )}
      {isSuccess && (
        <Typography
          variant="small"
          role="status"
          className="rounded-lg bg-secondary px-3 py-2.5 text-secondary-foreground"
        >
          {forgotPasswordContent.successMessage}
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
            {forgotPasswordContent.submittingCta}
          </>
        ) : (
          <>
            {forgotPasswordContent.submitCta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
};
