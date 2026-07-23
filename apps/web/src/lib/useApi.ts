"use client";

import useSWR, {
  mutate as globalMutate,
  type SWRConfiguration,
} from "swr";
import { get } from "./api";

/**
 * Keyed client cache over the API. The SWR key IS the request path, so every
 * component that reads the same endpoint shares one cache entry and one
 * in-flight request (dedup). Pass `null` to disable the fetch (SWR conditional
 * fetching) until a param is ready.
 */
export function useApiQuery<T>(key: string | null, config?: SWRConfiguration<T>) {
  return useSWR<T>(key, (path: string) => get<T>(path), config);
}

/**
 * Revalidate every cached endpoint whose key starts with `prefix`, so one call
 * refreshes all variants (e.g. `invalidate("/todos")` covers `/todos`,
 * `/todos?status=pending`, and `/todos/logs`).
 */
export function invalidate(prefix: string) {
  return globalMutate(
    (key) => typeof key === "string" && key.startsWith(prefix),
    undefined,
    { revalidate: true }
  );
}

export { globalMutate as mutate };
