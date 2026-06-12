"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordField } from "@/components/common/PasswordField";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { resetPasswordContent } from "@/data/auth";
import { supabase } from "@/lib/supabase";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/lib/validations/auth";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  // Live validity for the disabled state without surfacing errors early.
  const canSubmit = resetPasswordSchema.isValidSync(watch());

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push("/account");
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <PasswordField
        id="password"
        label={resetPasswordContent.password.label}
        placeholder={resetPasswordContent.password.placeholder}
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordField
        id="confirmPassword"
        label={resetPasswordContent.confirmPassword.label}
        placeholder={resetPasswordContent.confirmPassword.placeholder}
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
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
            {resetPasswordContent.submittingCta}
          </>
        ) : (
          <>
            {resetPasswordContent.submitCta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
};
