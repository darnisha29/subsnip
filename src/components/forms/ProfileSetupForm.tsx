"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowRight, LoaderCircle, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ChoicePills } from "@/components/common/ChoicePills";
import { SelectField } from "@/components/common/SelectField";
import { TextField } from "@/components/common/TextField";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { profileSetupContent } from "@/data/onboarding";
import { supabase } from "@/lib/supabase";
import {
  type ProfileSetupFormValues,
  profileSetupSchema,
  type UserLanguage,
} from "@/lib/validations/auth";

export const ProfileSetupForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSetupFormValues>({
    resolver: yupResolver(profileSetupSchema),
    mode: "onTouched",
    defaultValues: {
      language: "en",
      alertLeadDays: 3,
      quietHoursStart: profileSetupContent.quietHours.defaultStart,
      quietHoursEnd: profileSetupContent.quietHours.defaultEnd,
    },
  });

  // Pre-fill the name from Google OAuth metadata so most users just confirm.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const metadata = data.user?.user_metadata as
        | Record<string, unknown>
        | undefined;
      const fullName = metadata?.full_name;
      if (typeof fullName === "string" && fullName.length > 0) {
        setValue("name", fullName);
      }
    });
  }, [setValue]);

  // Live validity for the disabled state without surfacing errors early.
  const canSubmit = profileSetupSchema.isValidSync(watch());

  const onSubmit = async (values: ProfileSetupFormValues) => {
    setServerError(null);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setServerError("Your session has expired. Please sign in again.");
      return;
    }
    // Update-only by design: the profiles row is created by the DB signup
    // trigger (subsnip-be), and the authenticated role has no INSERT grant.
    const { data: updated, error } = await supabase
      .from("profiles")
      .update({
        name: values.name,
        language: values.language,
        alert_lead_days: values.alertLeadDays,
        quiet_hours_start: values.quietHoursStart,
        quiet_hours_end: values.quietHoursEnd,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", userData.user.id)
      .select("id")
      .maybeSingle();
    if (error) {
      setServerError(error.message);
      return;
    }
    if (!updated) {
      setServerError(
        "We couldn't find your profile. Please sign out and sign in again.",
      );
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <Card className="gap-0 py-0 ring-border">
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {profileSetupContent.aboutLabel}
          </Typography>
          <TextField
            id="name"
            type="text"
            label={profileSetupContent.name.label}
            placeholder={profileSetupContent.name.placeholder}
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Controller
            control={control}
            name="language"
            render={({ field }) => (
              <SelectField
                id="language"
                label={profileSetupContent.language.label}
                placeholder={profileSetupContent.language.placeholder}
                options={profileSetupContent.language.options}
                value={field.value}
                onChange={(value) => field.onChange(value as UserLanguage)}
                error={errors.language?.message}
              />
            )}
          />
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 ring-border">
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {profileSetupContent.alertLabel}
          </Typography>
          <Controller
            control={control}
            name="alertLeadDays"
            render={({ field }) => (
              <ChoicePills
                label={profileSetupContent.alertTiming.label}
                options={profileSetupContent.alertTiming.options}
                value={field.value}
                onChange={field.onChange}
                error={errors.alertLeadDays?.message}
              />
            )}
          />
          <div className="flex flex-col gap-2">
            <Typography
              as="span"
              variant="small"
              className="font-medium text-foreground"
            >
              {profileSetupContent.quietHours.label}
            </Typography>
            <div className="flex items-center gap-3">
              <TextField
                id="quietHoursStart"
                type="time"
                label={profileSetupContent.quietHours.startLabel}
                labelHidden
                leadingIcon={<Moon className="size-4" />}
                error={errors.quietHoursStart?.message}
                {...register("quietHoursStart")}
              />
              <Typography as="span" variant="small" className="shrink-0">
                {profileSetupContent.quietHours.toLabel}
              </Typography>
              <TextField
                id="quietHoursEnd"
                type="time"
                label={profileSetupContent.quietHours.endLabel}
                labelHidden
                leadingIcon={<Sun className="size-4" />}
                error={errors.quietHoursEnd?.message}
                {...register("quietHoursEnd")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
            {profileSetupContent.submittingCta}
          </>
        ) : (
          <>
            {profileSetupContent.cta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
};
