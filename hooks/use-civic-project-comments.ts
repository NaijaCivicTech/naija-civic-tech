"use client";

import {
  civicProjectKeys,
  fetchProjectCommentsPage,
  postProjectComment,
} from "@/lib/civic-api";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProjectComments(projectId: string | null, enabled: boolean) {
  return useInfiniteQuery({
    queryKey:
      projectId != null
        ? ([...civicProjectKeys.comments(projectId), "paged"] as const)
        : (["civic-comments", "disabled"] as const),
    queryFn: ({ pageParam }) =>
      fetchProjectCommentsPage(projectId!, pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: enabled && Boolean(projectId),
  });
}

export function usePostProjectCommentMutation(projectId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => {
      if (!projectId) throw new Error("No project");
      return postProjectComment(projectId, body);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: civicProjectKeys.comments(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: civicProjectKeys.all,
        });
      }
    },
  });
}
