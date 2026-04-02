"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import {
  findProjectInCaches,
  patchProjectVotesInCaches,
} from "@/lib/civic-query-cache";
import { civicProjectKeys, postVote } from "@/lib/civic-api";

export function useCivicVote() {
  const queryClient = useQueryClient();
  const { status } = useSession();
  const canVote = status === "authenticated";

  const { mutate: runVote } = useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: 1 | -1 }) =>
      postVote(id, delta),
    onMutate: async ({ id, delta }) => {
      await queryClient.cancelQueries({ queryKey: civicProjectKeys.all });
      const previousEntries = queryClient.getQueriesData({
        queryKey: civicProjectKeys.all,
      });
      patchProjectVotesInCaches(
        queryClient,
        id,
        (findProjectInCaches(queryClient, id)?.votes ?? 0) + delta,
        delta === 1,
      );
      return { previousEntries };
    },
    onError: (_err, _vars, context) => {
      for (const [key, data] of context?.previousEntries ?? []) {
        queryClient.setQueryData(key, data);
      }
    },
    onSuccess: (data) => {
      patchProjectVotesInCaches(
        queryClient,
        data.id,
        data.votes,
        data.viewerHasVoted,
      );
    },
  });

  const toggleVote = useCallback(
    (id: string) => {
      if (!canVote) return;
      const p = findProjectInCaches(queryClient, id);
      const hasVoted = p?.viewerHasVoted === true;
      runVote({ id, delta: hasVoted ? -1 : 1 });
    },
    [canVote, queryClient, runVote],
  );

  return { canVote, toggleVote };
}
