"use client";

import { useSyncExternalStore } from "react";

/** Tailwind `lg` breakpoint (1024px). Server snapshot false = mobile-first. */
export function useMinWidthLg() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}
