"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TeamRole } from "@/data/types";
import {
  civicProjectKeys,
  postIdea,
  postListing,
  postTeamMember,
} from "@/lib/civic-api";

export function useSubmitListingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postListing,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: civicProjectKeys.all });
    },
  });
}

export function useSubmitIdeaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postIdea,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: civicProjectKeys.all });
    },
  });
}

export function useJoinTeamMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      role,
    }: {
      projectId: string;
      role: TeamRole;
    }) => postTeamMember(projectId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: civicProjectKeys.all });
    },
  });
}
