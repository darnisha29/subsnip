import { configureStore } from "@reduxjs/toolkit";

import { subscriptionsReducer } from "@/store/slices/subscriptionsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      subscriptions: subscriptionsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
