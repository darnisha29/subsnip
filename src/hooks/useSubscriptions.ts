"use client";

import { useCallback, useEffect } from "react";

import {
  buildSubscriptionInsert,
  buildSubscriptionUpdate,
} from "@/lib/subscriptions";
import { supabase } from "@/lib/supabase";
import type { SubscriptionFormValues } from "@/lib/validations/subscription";
import { useAppDispatch, useAppSelector, useAppStore } from "@/store/hooks";
import {
  fetchFailed,
  fetchStarted,
  fetchSucceeded,
  type Subscription,
  subscriptionRemoved,
  subscriptionUpserted,
} from "@/store/slices/subscriptionsSlice";

type MutationResult = { error?: string };

const SESSION_EXPIRED = "Your session has expired. Please sign in again.";

export const useSubscriptions = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { items, status, error } = useAppSelector(
    (state) => state.subscriptions,
  );

  const loadSubscriptions = useCallback(async () => {
    dispatch(fetchStarted());
    const { data, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*");
    if (fetchError) {
      dispatch(fetchFailed(fetchError.message));
      return;
    }
    dispatch(fetchSucceeded(data));
  }, [dispatch]);

  const createSubscription = useCallback(
    async (values: SubscriptionFormValues): Promise<MutationResult> => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        return { error: SESSION_EXPIRED };
      }
      const { data, error: insertError } = await supabase
        .from("subscriptions")
        .insert(buildSubscriptionInsert(values, userData.user.id))
        .select()
        .single();
      if (insertError) {
        return { error: insertError.message };
      }
      dispatch(subscriptionUpserted(data));
      return {};
    },
    [dispatch],
  );

  const updateSubscription = useCallback(
    async (
      existing: Subscription,
      values: SubscriptionFormValues,
    ): Promise<MutationResult> => {
      const { data, error: updateError } = await supabase
        .from("subscriptions")
        .update(buildSubscriptionUpdate(values, existing))
        .eq("id", existing.id)
        .select()
        .single();
      if (updateError) {
        return { error: updateError.message };
      }
      dispatch(subscriptionUpserted(data));
      return {};
    },
    [dispatch],
  );

  const removeSubscription = useCallback(
    async (id: string): Promise<MutationResult> => {
      const { error: deleteError } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);
      if (deleteError) {
        return { error: deleteError.message };
      }
      dispatch(subscriptionRemoved(id));
      return {};
    },
    [dispatch],
  );

  useEffect(() => {
    // Live-state guard: only the very first mount per session sees "idle",
    // so page switches (and strict-mode double mounts) reuse the stored data
    // instead of calling the API again.
    if (store.getState().subscriptions.status !== "idle") {
      return;
    }
    void loadSubscriptions();
  }, [store, loadSubscriptions]);

  return {
    subscriptions: items,
    status,
    error,
    refetch: loadSubscriptions,
    createSubscription,
    updateSubscription,
    removeSubscription,
  };
};
