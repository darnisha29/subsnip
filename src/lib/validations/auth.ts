import * as yup from "yup";

import type { Database } from "@/types/supabase";

export type UserLanguage = Database["public"]["Enums"]["user_language"];

const USER_LANGUAGES: UserLanguage[] = ["en", "hi", "ta", "te", "bn", "mr"];
const ALERT_LEAD_DAYS = [1, 3, 7] as const;

export const signUpSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type SignUpFormValues = yup.InferType<typeof signUpSchema>;

export const signInSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup.string().required("Password is required"),
});

export type SignInFormValues = yup.InferType<typeof signInSchema>;

export const profileSetupSchema = yup.object({
  name: yup.string().trim().required("Your name is required"),
  language: yup
    .mixed<UserLanguage>()
    .oneOf(USER_LANGUAGES, "Select a language")
    .required("Select a language"),
  alertLeadDays: yup
    .number()
    .oneOf([...ALERT_LEAD_DAYS], "Choose an alert timing")
    .required("Choose an alert timing"),
  quietHoursStart: yup.string().required("Start time is required"),
  quietHoursEnd: yup.string().required("End time is required"),
});

export type ProfileSetupFormValues = yup.InferType<typeof profileSetupSchema>;
