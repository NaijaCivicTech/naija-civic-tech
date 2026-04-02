import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { CivicProject } from "@/data/types";
import type { CivicProjectsStatsDto, ProjectsListPageDto } from "@/lib/services/client/projects";
import { civicProjectKeys } from "@/lib/services/client/projects";

function isStatsPayload(x: unknown): x is CivicProjectsStatsDto {
  return (
    typeof x === "object" &&
    x !== null &&
    "totalListed" in x &&
    typeof (x as { totalListed: unknown }).totalListed === "number"
  );
}

function applyVotePatch(
  p: CivicProject,
  projectId: string,
  votes: number,
  viewerHasVoted: boolean,
): CivicProject {
  if (p.id !== projectId) return p;
  return { ...p, votes, viewerHasVoted };
}

export function patchProjectVotesInCaches(
  queryClient: QueryClient,
  projectId: string,
  votes: number,
  viewerHasVoted: boolean,
) {
  queryClient.setQueriesData({ queryKey: civicProjectKeys.all }, (old: unknown) => {
    if (old == null) return old;
    if (isStatsPayload(old)) return old;
    if (Array.isArray(old)) {
      return (old as CivicProject[]).map((p) =>
        applyVotePatch(p, projectId, votes, viewerHasVoted),
      );
    }
    if (
      typeof old === "object" &&
      "pages" in old &&
      Array.isArray((old as InfiniteData<ProjectsListPageDto>).pages)
    ) {
      const inf = old as InfiniteData<ProjectsListPageDto>;
      return {
        ...inf,
        pages: inf.pages.map((page) => ({
          ...page,
          projects: page.projects.map((p) =>
            applyVotePatch(p, projectId, votes, viewerHasVoted),
          ),
        })),
      };
    }
    if (
      typeof old === "object" &&
      old !== null &&
      "id" in old &&
      (old as CivicProject).id === projectId
    ) {
      return applyVotePatch(
        old as CivicProject,
        projectId,
        votes,
        viewerHasVoted,
      );
    }
    return old;
  });
}

export function findProjectInCaches(
  queryClient: QueryClient,
  projectId: string,
): CivicProject | undefined {
  const entries = queryClient.getQueriesData<unknown>({
    queryKey: civicProjectKeys.all,
  });
  for (const [, data] of entries) {
    if (data == null || isStatsPayload(data)) continue;
    if (Array.isArray(data)) {
      const hit = (data as CivicProject[]).find((p) => p.id === projectId);
      if (hit) return hit;
    }
    if (
      typeof data === "object" &&
      "pages" in data &&
      Array.isArray((data as InfiniteData<ProjectsListPageDto>).pages)
    ) {
      for (const page of (data as InfiniteData<ProjectsListPageDto>).pages) {
        const hit = page.projects.find((p) => p.id === projectId);
        if (hit) return hit;
      }
    }
    if (
      typeof data === "object" &&
      data !== null &&
      "id" in data &&
      (data as CivicProject).id === projectId
    ) {
      return data as CivicProject;
    }
  }
  return undefined;
}
