import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Database } from "@/types/supabase";

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

export type FetchStatus = "idle" | "loading" | "succeeded" | "failed";

interface SubscriptionsState {
  items: Subscription[];
  status: FetchStatus;
  error: string | null;
}

const initialState: SubscriptionsState = {
  items: [],
  status: "idle",
  error: null,
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    fetchStarted: (state) => {
      state.status = "loading";
      state.error = null;
    },
    fetchSucceeded: (state, action: PayloadAction<Subscription[]>) => {
      state.status = "succeeded";
      state.items = action.payload;
    },
    fetchFailed: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
    // Insert or replace a single row in place so create/edit reflect instantly
    // without a full refetch.
    subscriptionUpserted: (state, action: PayloadAction<Subscription>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index === -1) {
        state.items.unshift(action.payload);
      } else {
        state.items[index] = action.payload;
      }
    },
    subscriptionRemoved: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  fetchStarted,
  fetchSucceeded,
  fetchFailed,
  subscriptionUpserted,
  subscriptionRemoved,
} = subscriptionsSlice.actions;
export const subscriptionsReducer = subscriptionsSlice.reducer;
