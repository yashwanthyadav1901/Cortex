"use client";

import type { ReactNode } from "react";
import { SWRConfig } from "swr";

/**
 * Global SWR defaults. `revalidateOnFocus` replaces the hand-rolled
 * window-focus refetch listeners that lived in individual components.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
        keepPreviousData: true,
        errorRetryCount: 2,
      }}
    >
      {children}
    </SWRConfig>
  );
}
