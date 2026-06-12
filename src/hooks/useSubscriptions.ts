"use client";

import { useCallback, useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { useAppDispatch, useAppSelector, useAppStore } from "@/store/hooks";
import {
  fetchFailed,
  fetchStarted,
  fetchSucceeded,
} from "@/store/slices/subscriptionsSlice";

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

  useEffect(() => {
    // Live-state guard: only the very first mount per session sees "idle",
    // so page switches (and strict-mode double mounts) reuse the stored data
    // instead of calling the API again.
    if (store.getState().subscriptions.status !== "idle") {
      return;
    }
    void loadSubscriptions();
  }, [store, loadSubscriptions]);

  return { subscriptions: items, status, error, refetch: loadSubscriptions };
};
