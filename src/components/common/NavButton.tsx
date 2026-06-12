"use client";

import { LoaderCircle } from "lucide-react";
import Link, { useLinkStatus } from "next/link";

import { Button } from "@/components/ui/button";

interface NavButtonProps {
  href: string;
  children: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
}

const TrailingStatus = ({ idleIcon }: { idleIcon?: React.ReactNode }) => {
  const { pending } = useLinkStatus();

  if (pending) {
    return <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />;
  }
  return idleIcon ?? null;
};

// CTA button that navigates via Link; while the destination route loads, the
// trailing icon becomes a spinner so the click never feels dead.
export const NavButton = ({
  href,
  children,
  trailingIcon,
  className,
}: NavButtonProps) => {
  return (
    <Button asChild className={className}>
      <Link href={href}>
        {children}
        <TrailingStatus idleIcon={trailingIcon} />
      </Link>
    </Button>
  );
};
