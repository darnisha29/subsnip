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
  },
});

export const { fetchStarted, fetchSucceeded, fetchFailed } =
  subscriptionsSlice.actions;
export const subscriptionsReducer = subscriptionsSlice.reducer;
