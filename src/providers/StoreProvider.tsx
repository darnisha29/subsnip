"use client";

import { useState } from "react";
import { Provider } from "react-redux";

import { makeStore } from "@/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

// One store instance per request/session: the lazy initializer runs once per
// mounted tree, so server renders never share state across users.
export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
};
