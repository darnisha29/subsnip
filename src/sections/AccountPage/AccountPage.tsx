"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Typography } from "@/components/common/Typography";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { accountContent } from "@/data/account";
import { supabase } from "@/lib/supabase";

interface AccountUser {
  name: string;
  email: string;
}

export const AccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/signin");
        return;
      }
      const metadata = data.user.user_metadata as
        | Record<string, unknown>
        | undefined;
      const fullName = metadata?.full_name;
      setUser({
        name:
          typeof fullName === "string" && fullName.length > 0
            ? fullName
            : (data.user.email ?? "Your account"),
        email: data.user.email ?? "",
      });
    });
  }, [router]);

  const initials = (user?.name ?? "")
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };

  const handleDeleteAccount = async () => {
    // TODO: call the backend purge endpoint once subsnip-be exposes it.
    await supabase.auth.signOut();
    router.push("/signup");
  };

  return (
    <main className="min-h-dvh bg-linear-to-b from-background to-surface-tint px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Typography variant="h2">{accountContent.title}</Typography>

        <Card className="gap-0 py-0 ring-border">
          <CardContent className="flex items-center gap-3 p-4 sm:p-5">
            <Typography
              as="span"
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-pill text-sm font-bold text-pill-foreground"
            >
              {initials || "·"}
            </Typography>
            <div className="flex min-w-0 flex-col">
              <Typography
                as="span"
                variant="body"
                className="truncate font-semibold"
              >
                {user?.name ?? "Loading…"}
              </Typography>
              <Typography as="span" variant="small" className="truncate">
                {user?.email}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <section className="flex flex-col gap-2.5">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {accountContent.connectedLabel}
          </Typography>
          <Card className="gap-0 py-0 ring-border">
            <CardContent className="flex flex-col p-0">
              {accountContent.connections.map((connection, index) => (
                <div
                  key={connection.key}
                  className={
                    index > 0
                      ? "flex items-center justify-between gap-3 border-t border-border px-4 py-3.5"
                      : "flex items-center justify-between gap-3 px-4 py-3.5"
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="relative flex size-2 shrink-0"
                    >
                      <span className="relative inline-flex size-2 rounded-full bg-success" />
                    </span>
                    <div className="flex flex-col">
                      <Typography
                        as="span"
                        variant="body"
                        className="font-medium"
                      >
                        {connection.name}
                      </Typography>
                      <Typography as="span" variant="small">
                        {connection.status}
                      </Typography>
                    </div>
                  </div>
                  {/* TODO: wire revoke/unlink to the backend once available. */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary"
                  >
                    {connection.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-2.5">
          <Typography
            as="span"
            variant="caption"
            className="font-semibold tracking-wider uppercase"
          >
            {accountContent.preferencesLabel}
          </Typography>
          <Card className="gap-0 py-0 ring-border">
            <CardContent className="flex flex-col p-0">
              {accountContent.preferences.map((preference, index) => (
                <Link
                  key={preference.label}
                  href="/profile-setup"
                  className={
                    index > 0
                      ? "flex items-center justify-between gap-3 border-t border-border px-4 py-3.5 transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50"
                      : "flex items-center justify-between gap-3 px-4 py-3.5 transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50"
                  }
                >
                  <Typography as="span" variant="body" className="font-medium">
                    {preference.label}
                  </Typography>
                  <span className="flex items-center gap-1.5">
                    <Typography as="span" variant="small">
                      {preference.value}
                    </Typography>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 text-tertiary"
                    />
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="h-12 w-full rounded-full bg-card text-sm font-semibold"
          >
            {accountContent.signOutCta}
          </Button>
          <ConfirmDialog
            destructive
            title={accountContent.deleteDialog.title}
            description={accountContent.deleteDialog.description}
            cancelLabel={accountContent.deleteDialog.cancel}
            confirmLabel={accountContent.deleteDialog.confirm}
            onConfirm={handleDeleteAccount}
            trigger={
              <Button
                variant="outline"
                className="h-12 w-full rounded-full border-destructive/40 bg-card text-sm font-semibold text-destructive hover:bg-destructive/5 hover:text-destructive"
              >
                {accountContent.deleteCta}
              </Button>
            }
          />
        </div>
      </div>
    </main>
  );
};
