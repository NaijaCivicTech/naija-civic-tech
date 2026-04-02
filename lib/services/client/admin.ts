import type { CivicProject } from "@/data/types";
import type { ProjectsListPageDto } from "@/lib/services/client/projects";

export type AdminListingStatus = "pending" | "approved" | "all";

export async function fetchAdminListings(params: {
  status: AdminListingStatus;
  limit?: number;
  cursor?: string | null;
}): Promise<ProjectsListPageDto> {
  const sp = new URLSearchParams();
  sp.set("status", params.status);
  sp.set("limit", String(params.limit ?? 24));
  if (params.cursor) sp.set("cursor", params.cursor);
  const res = await fetch(`/api/admin/listings?${sp}`, {
    credentials: "include",
  });
  const data = (await res.json()) as ProjectsListPageDto & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Failed to load (${res.status})`);
  }
  if (!Array.isArray(data.projects)) {
    throw new Error("Invalid response");
  }
  return {
    projects: data.projects,
    nextCursor: data.nextCursor ?? null,
    ...(typeof data.total === "number" ? { total: data.total } : {}),
  };
}

export async function fetchAdminSuggestions(params: {
  limit?: number;
  cursor?: string | null;
}): Promise<ProjectsListPageDto> {
  const sp = new URLSearchParams();
  sp.set("limit", String(params.limit ?? 24));
  if (params.cursor) sp.set("cursor", params.cursor);
  const res = await fetch(`/api/admin/suggestions?${sp}`, {
    credentials: "include",
  });
  const data = (await res.json()) as ProjectsListPageDto & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Failed to load (${res.status})`);
  }
  if (!Array.isArray(data.projects)) {
    throw new Error("Invalid response");
  }
  return {
    projects: data.projects,
    nextCursor: data.nextCursor ?? null,
    ...(typeof data.total === "number" ? { total: data.total } : {}),
  };
}

export async function patchListingApproval(
  projectId: string,
  approved: boolean,
): Promise<CivicProject> {
  const res = await fetch(
    `/api/admin/projects/${projectId}/listing-approval`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ approved }),
    },
  );
  const data = (await res.json()) as {
    project?: CivicProject;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(data.error ?? `Update failed (${res.status})`);
  }
  if (!data.project) throw new Error("Invalid response");
  return data.project;
}
