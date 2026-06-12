"use client";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";

interface GoogleAuthButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const GoogleAuthButton = ({
  label,
  onClick,
  disabled,
}: GoogleAuthButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="h-12 w-full gap-2.5 rounded-full bg-card text-sm font-medium"
    >
      <GoogleIcon className="size-4.5" />
      {label}
    </Button>
  );
};
