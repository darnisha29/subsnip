"use client";

import {
  BookOpen,
  CreditCard,
  LayoutGrid,
  type LucideIcon,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Typography } from "@/components/common/Typography";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  hasDot?: boolean;
}

// Only Subscriptions is wired today; the rest are placeholders for parked
// features (overview, insights, guides) rendered as disabled rail icons so the
// nav matches the product shell without dead links.
const PRIMARY_NAV: NavItem[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "subscriptions", label: "Subscriptions", icon: CreditCard, href: "/dashboard" },
  { key: "insights", label: "Insights", icon: Sparkles, hasDot: true },
  { key: "guides", label: "Cancel guides", icon: BookOpen },
];

const railItemClass = (active: boolean) =>
  cn(
    "relative flex size-11 items-center justify-center rounded-xl text-tertiary transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    active
      ? "bg-secondary text-secondary-foreground"
      : "hover:bg-muted hover:text-foreground",
  );

const RailIcon = ({ item, active }: { item: NavItem; active: boolean }) => {
  const Icon = item.icon;
  const content = (
    <>
      <Icon aria-hidden="true" className="size-5" />
      {item.hasDot && (
        <span
          aria-hidden="true"
          className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-destructive"
        />
      )}
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        className={railItemClass(active)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-label={`${item.label} (coming soon)`}
      title="Coming soon"
      className={cn(railItemClass(false), "opacity-45")}
    >
      {content}
    </button>
  );
};

export const AppSidebar = () => {
  const pathname = usePathname();
  const [initial, setInitial] = useState("·");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const metadata = data.user?.user_metadata as
        | Record<string, unknown>
        | undefined;
      const fullName = metadata?.full_name;
      const source =
        (typeof fullName === "string" && fullName) || data.user?.email || "";
      setInitial(source.charAt(0).toUpperCase() || "·");
    });
  }, []);

  const accountActive = pathname.startsWith("/account");

  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 flex h-16 flex-row items-center justify-between gap-2 border-t border-border bg-sidebar px-5 md:static md:inset-auto md:h-dvh md:w-18 md:flex-col md:justify-between md:gap-0 md:border-t-0 md:border-r md:px-0 md:py-5">
      {/* Top cluster: brand + primary nav, pinned together at the top. */}
      <div className="flex flex-row items-center gap-1.5 md:flex-col md:gap-3">
        <Link
          href="/dashboard"
          aria-label="Subsnip home"
          className="hidden size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 md:mb-1 md:flex"
        >
          <Typography as="span" variant="inherit" aria-hidden="true">
            S
          </Typography>
        </Link>

        <nav
          aria-label="Primary"
          className="flex flex-row items-center gap-1.5 md:flex-col md:gap-2"
        >
          {PRIMARY_NAV.map((item) => (
            <RailIcon
              key={item.key}
              item={item}
              active={
                Boolean(item.href) && pathname.startsWith(item.href ?? "")
              }
            />
          ))}
        </nav>
      </div>

      <div className="flex flex-row items-center gap-1.5 md:flex-col md:gap-2">
        <Link
          href="/account"
          aria-label="Settings"
          aria-current={accountActive ? "page" : undefined}
          className={railItemClass(accountActive)}
        >
          <Settings aria-hidden="true" className="size-5" />
        </Link>
        <Link
          href="/account"
          aria-label="Your account"
          className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Typography as="span" variant="inherit" aria-hidden="true">
            {initial}
          </Typography>
        </Link>
      </div>
    </aside>
  );
};
