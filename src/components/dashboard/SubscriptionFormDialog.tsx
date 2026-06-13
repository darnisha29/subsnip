"use client";

import type { DefaultValues } from "react-hook-form";

import { SubscriptionForm } from "@/components/forms/SubscriptionForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SubscriptionFormValues } from "@/lib/validations/subscription";

interface SubscriptionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  defaultValues: DefaultValues<SubscriptionFormValues>;
  nameEditable?: boolean;
  submitCta: string;
  submittingCta: string;
  onSubmit: (values: SubscriptionFormValues) => Promise<{ error?: string }>;
}

export const SubscriptionFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  defaultValues,
  nameEditable,
  submitCta,
  submittingCta,
  onSubmit,
}: SubscriptionFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <SubscriptionForm
          defaultValues={defaultValues}
          nameEditable={nameEditable}
          submitCta={submitCta}
          submittingCta={submittingCta}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
