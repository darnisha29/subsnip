import Link from "next/link";

import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
}

export const AppLogo = ({ className }: AppLogoProps) => {
  return (
    <Link
      href="/"
      aria-label="Subsnip home"
      className={cn(
        "flex w-fit items-center gap-2.5 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Typography
        as="span"
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
      >
        S
      </Typography>
      <Typography as="span" className="text-base font-semibold">
        Subsnip
      </Typography>
    </Link>
  );
};
