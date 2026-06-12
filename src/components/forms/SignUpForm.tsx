"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordField } from "@/components/common/PasswordField";
import { TextField } from "@/components/common/TextField";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { signUpContent } from "@/data/auth";
import { supabase } from "@/lib/supabase";
import { type SignUpFormValues, signUpSchema } from "@/lib/validations/auth";

export const SignUpForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError(null);
    setIsSuccess(false);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
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
        label={signUpContent.email.label}
        placeholder={signUpContent.email.placeholder}
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordField
        id="password"
        label={signUpContent.password.label}
        placeholder={signUpContent.password.placeholder}
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
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
          className="rounded-lg bg-secondary px-3 py-2.5 leading-5 text-secondary-foreground"
        >
          {signUpContent.successMessage}
        </Typography>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="h-12 w-full rounded-full text-sm font-semibold"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            {signUpContent.submittingCta}
          </>
        ) : (
          <>
            {signUpContent.submitCta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
};
