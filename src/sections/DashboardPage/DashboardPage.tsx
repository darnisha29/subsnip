"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Typography } from "@/components/common/Typography";
import { SubscriptionFormDialog } from "@/components/dashboard/SubscriptionFormDialog";
import { SubscriptionGridView } from "@/components/dashboard/SubscriptionGridView";
import { SubscriptionHeader } from "@/components/dashboard/SubscriptionHeader";
import { SubscriptionListView } from "@/components/dashboard/SubscriptionListView";
import { SubscriptionStats } from "@/components/dashboard/SubscriptionStats";
import { SubscriptionToolbar } from "@/components/dashboard/SubscriptionToolbar";
import { dashboardContent } from "@/data/dashboard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { supabase } from "@/lib/supabase";
import type { SubscriptionFormValues } from "@/lib/validations/subscription";
import {
  type DisplaySubscription,
  type FilterKey,
  filterSubscriptions,
  isTrialRow,
  type SortKey,
  sortSubscriptions,
  distinctCategories,
  groupSubscriptions,
  type ViewMode,
} from "@/utils/subscriptionFilters";
import {
  activeSubscriptionCount,
  annualTotalINR,
  monthlyEquivalentINR,
  renewingSoon,
  renewingSoonTotalINR,
  trialSubscriptions,
} from "@/utils/subscriptionMath";

interface ServiceMeta {
  name: string;
  category: string | null;
}

const GROUP_LABELS = {
  renewing: dashboardContent.groups.renewingThisWeek,
  active: dashboardContent.groups.active,
  trials: dashboardContent.filters.trials,
};

const editDefaults = (
  subscription: DisplaySubscription,
): SubscriptionFormValues => ({
  name: subscription.displayName,
  amount: Number(subscription.amount),
  billingCycle: subscription.billing_cycle,
  category: subscription.user_category ?? "",
  nextRenewalDate: subscription.next_renewal_date ?? "",
  isTrial: isTrialRow(subscription),
});

export const DashboardPage = () => {
  const {
    subscriptions,
    status,
    createSubscription,
    updateSubscription,
    removeSubscription,
  } = useSubscriptions();

  const [services, setServices] = useState<Record<string, ServiceMeta>>({});
  const [filter, setFilter] = useState<FilterKey>("all");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("renewal");
  const [view, setView] = useState<ViewMode>("grid");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<DisplaySubscription | null>(null);
  const [deleting, setDeleting] = useState<DisplaySubscription | null>(null);

  // Catalog metadata for service-linked rows; manual rows fall back to their
  // own manual_name / user_category.
  useEffect(() => {
    supabase
      .from("services")
      .select("id, name, category")
      .then(({ data }) => {
        if (data) {
          setServices(
            Object.fromEntries(
              data.map((service) => [
                service.id,
                { name: service.name, category: service.category },
              ]),
            ),
          );
        }
      });
  }, []);

  const displaySubs = useMemo<DisplaySubscription[]>(
    () =>
      subscriptions.map((subscription) => {
        const service = subscription.service_id
          ? services[subscription.service_id]
          : undefined;
        return {
          ...subscription,
          displayName:
            service?.name || subscription.manual_name || "Subscription",
          displayCategory:
            subscription.user_category || service?.category || null,
        };
      }),
    [subscriptions, services],
  );

  const groups = useMemo(() => {
    const visible = sortSubscriptions(
      filterSubscriptions(displaySubs, filter, category),
      sort,
    );
    return groupSubscriptions(visible, filter, GROUP_LABELS);
  }, [displaySubs, filter, category, sort]);

  const isLoading = status === "idle" || status === "loading";
  const isEmpty = !isLoading && subscriptions.length === 0;

  const counts = {
    all: subscriptions.length,
    renewing: renewingSoon(subscriptions).length,
    trials: trialSubscriptions(subscriptions).length,
  };

  const handleCreate = async (values: SubscriptionFormValues) => {
    const result = await createSubscription(values);
    if (!result.error) {
      setIsAddOpen(false);
    }
    return result;
  };

  const handleUpdate = async (values: SubscriptionFormValues) => {
    if (!editing) {
      return {};
    }
    const result = await updateSubscription(editing, values);
    if (!result.error) {
      setEditing(null);
    }
    return result;
  };

  const handleConfirmDelete = async () => {
    if (deleting) {
      await removeSubscription(deleting.id);
    }
    setDeleting(null);
  };

  return (
    <main className="flex flex-1 flex-col bg-linear-to-b from-background to-surface-tint px-4 py-6 sm:px-8 sm:py-9">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <SubscriptionHeader
          activeCount={activeSubscriptionCount(subscriptions)}
          monthlyOutflow={monthlyEquivalentINR(subscriptions)}
          onAddClick={() => setIsAddOpen(true)}
        />

        {isLoading ? (
          <div
            role="status"
            aria-label="Loading"
            className="flex justify-center py-24"
          >
            <LoaderCircle
              aria-hidden="true"
              className="size-7 animate-spin text-primary"
            />
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-16 text-center">
            <Typography variant="h3">{dashboardContent.empty.title}</Typography>
            <Typography variant="small">
              {dashboardContent.empty.message}
            </Typography>
          </div>
        ) : (
          <>
            <SubscriptionStats
              monthly={monthlyEquivalentINR(subscriptions)}
              annual={annualTotalINR(subscriptions)}
              thisWeekTotal={renewingSoonTotalINR(subscriptions)}
              thisWeekCount={counts.renewing}
              trialsCount={counts.trials}
              activeCount={activeSubscriptionCount(subscriptions)}
            />

            <SubscriptionToolbar
              filter={filter}
              onFilterChange={setFilter}
              counts={counts}
              categories={distinctCategories(displaySubs)}
              category={category}
              onCategoryChange={setCategory}
              sort={sort}
              onSortChange={setSort}
              view={view}
              onViewChange={setView}
            />

            {groups.length === 0 ? (
              <Typography variant="small" className="py-10 text-center">
                Nothing matches these filters.
              </Typography>
            ) : view === "grid" ? (
              <SubscriptionGridView
                groups={groups}
                onEdit={setEditing}
                onDelete={setDeleting}
              />
            ) : (
              <SubscriptionListView
                groups={groups}
                onEdit={setEditing}
                onDelete={setDeleting}
              />
            )}
          </>
        )}
      </div>

      <SubscriptionFormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title={dashboardContent.form.addTitle}
        description={dashboardContent.form.addDescription}
        defaultValues={{
          name: "",
          billingCycle: "monthly",
          category: "",
          nextRenewalDate: "",
          isTrial: false,
        }}
        submitCta={dashboardContent.form.addSubmitCta}
        submittingCta={dashboardContent.form.addSubmittingCta}
        onSubmit={handleCreate}
      />

      {editing && (
        <SubscriptionFormDialog
          open
          onOpenChange={(open) => !open && setEditing(null)}
          title={dashboardContent.form.editTitle}
          description={dashboardContent.form.editDescription}
          defaultValues={editDefaults(editing)}
          nameEditable={!editing.service_id}
          submitCta={dashboardContent.form.editSubmitCta}
          submittingCta={dashboardContent.form.editSubmittingCta}
          onSubmit={handleUpdate}
        />
      )}

      <ConfirmDialog
        destructive
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={dashboardContent.deleteDialog.title}
        description={dashboardContent.deleteDialog.description}
        cancelLabel={dashboardContent.deleteDialog.cancel}
        confirmLabel={dashboardContent.deleteDialog.confirm}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
};
