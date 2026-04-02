"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  civicProjectKeys,
  fetchProjectById,
} from "@/lib/services/client/projects";

export function useCivicProjectDetail(
  projectId: string | null,
  enabled: boolean,
) {
  const { data: session, status } = useSession();
  const viewerKey =
    status === "loading" ? "pending" : (session?.user?.id ?? "guest");

  return useQuery({
    queryKey: civicProjectKeys.detail(viewerKey, projectId ?? ""),
    queryFn: () => fetchProjectById(projectId!),
    enabled:
      enabled && Boolean(projectId) && status !== "loading" && projectId != null,
  });
}
