"use client";

import { formatPostedAt, listingBadgeTw } from "@/lib/civic-utils";
import { cn } from "@/lib/cn";
import {
  fetchAdminListings,
  fetchAdminSuggestions,
  patchListingApproval,
  type AdminListingStatus,
} from "@/lib/services/client/admin";
import { civicProjectKeys } from "@/lib/services/client/projects";
import { civicModalStore } from "@/lib/civic-modal-store";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

const tabTw =
  "cursor-pointer rounded-full border-[1.5px] border-line bg-transparent px-4 py-1.5 font-sans text-[11px] font-medium text-muted transition-all hover:border-ink hover:text-ink";

const sectionTw =
  "cursor-pointer rounded-md border-[1.5px] border-line bg-paper px-4 py-2 font-sans text-xs font-semibold text-ink transition-colors hover:border-ink";

export function AdminListingsBoard() {
  const [section, setSection] = useState<"listings" | "suggestions">("listings");
  const [tab, setTab] = useState<AdminListingStatus>("pending");
  const queryClient = useQueryClient();

  const listingsQuery = useInfiniteQuery({
    queryKey: ["admin", "listings", tab],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      fetchAdminListings({
        status: tab,
        limit: 20,
        cursor: pageParam ?? undefined,
      }),
    getNextPageParam: (last) => last.nextCursor,
    enabled: section === "listings",
  });

  const suggestionsQuery = useInfiniteQuery({
    queryKey: ["admin", "suggestions"],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      fetchAdminSuggestions({
        limit: 20,
        cursor: pageParam ?? undefined,
      }),
    getNextPageParam: (last) => last.nextCursor,
    enabled: section === "suggestions",
  });

  const query = section === "listings" ? listingsQuery : suggestionsQuery;
  const flat = query.data?.pages.flatMap((p) => p.projects) ?? [];
  const total = query.data?.pages[0]?.total;

  const { mutateAsync: setApproval, isPending: isSaving } = useMutation({
    mutationFn: ({
      projectId,
      approved,
    }: {
      projectId: string;
      approved: boolean;
    }) => patchListingApproval(projectId, approved),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      void queryClient.invalidateQueries({ queryKey: civicProjectKeys.all });
    },
  });

  const onToggle = useCallback(
    async (projectId: string, approved: boolean) => {
      try {
        await setApproval({ projectId, approved });
      } catch (e) {
        window.alert(e instanceof Error ? e.message : "Update failed");
      }
    },
    [setApproval],
  );

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='flex flex-wrap gap-2'>
        <button
          type='button'
          className={cn(
            sectionTw,
            section === "listings" && "border-ink bg-ink text-paper hover:text-paper",
          )}
          onClick={() => setSection("listings")}
        >
          Directory listings
        </button>
        <button
          type='button'
          className={cn(
            sectionTw,
            section === "suggestions" &&
              "border-ink bg-ink text-paper hover:text-paper",
          )}
          onClick={() => setSection("suggestions")}
        >
          Pipeline suggestions
        </button>
      </div>

      {section === "listings" ? (
        <div className='flex flex-wrap gap-2'>
          {(
            [
              ["pending", "Pending approval"],
              ["approved", "Approved"],
              ["all", "All listings"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type='button'
              className={cn(
                tabTw,
                tab === key && "border-ink bg-ink text-paper hover:text-paper",
              )}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {query.isPending ? (
        <p className='text-sm text-muted'>Loading…</p>
      ) : query.isError ? (
        <p className='rounded-lg border border-flame/30 bg-flame-soft px-4 py-3 text-sm text-flame'>
          {query.error instanceof Error
            ? query.error.message
            : "Failed to load"}
        </p>
      ) : (
        <>
          <p className='text-[11px] text-muted'>
            {typeof total === "number"
              ? `${flat.length} loaded · ${total} total`
              : `${flat.length} loaded`}
            {section === "suggestions"
              ? " · ideas in the Suggested column"
              : null}
          </p>
          <div className='overflow-hidden rounded-lg border border-line bg-line'>
            {flat.length === 0 ? (
              <div className='bg-card px-6 py-12 text-center text-sm text-muted'>
                {section === "suggestions"
                  ? "No pipeline suggestions right now."
                  : "No listings in this view."}
              </div>
            ) : (
              <ul className='divide-y divide-line bg-card'>
                {flat.map((p) => {
                  if (section === "suggestions") {
                    return (
                      <li key={p.id} className='flex flex-col gap-3 p-4'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                          <div className='min-w-0 flex-1'>
                            <div className='flex flex-wrap items-center gap-2'>
                              <span className='text-lg leading-none'>
                                {p.icon}
                              </span>
                              <span className='font-display text-[15px] font-bold'>
                                {p.name}
                              </span>
                              <span className='rounded-full border border-line bg-paper px-2 py-0.5 text-[9px] font-semibold uppercase text-muted'>
                                Suggested
                              </span>
                              <span className='rounded-full border border-line bg-transparent px-2 py-0.5 text-[9px] font-semibold uppercase text-muted'>
                                {p.category}
                              </span>
                            </div>
                            {p.request?.trim() ? (
                              <div className='mt-2 rounded-md border border-line/80 bg-paper/80 px-2.5 py-2'>
                                <div className='text-[9px] font-semibold uppercase tracking-wider text-muted'>
                                  Request
                                </div>
                                <p className='text-[12px] leading-snug text-ink'>
                                  {p.request.trim()}
                                </p>
                              </div>
                            ) : null}
                            <p className='mt-2 text-xs leading-snug text-muted'>
                              <span className='font-medium text-ink/80'>
                                Approach ·{" "}
                              </span>
                              {p.description}
                            </p>
                            <p className='mt-1 text-[10px] text-muted'>
                              Posted {formatPostedAt(p.postedAt)} · ▲ {p.votes}{" "}
                              · {p.authorName}
                            </p>
                          </div>
                          <button
                            type='button'
                            className='shrink-0 rounded-md border border-line bg-paper px-3 py-1.5 font-sans text-xs font-medium text-ink hover:border-brand hover:text-brand'
                            onClick={() => civicModalStore.openProject(p.id)}
                          >
                            Open details
                          </button>
                        </div>
                      </li>
                    );
                  }

                  const approved =
                    p.listingApprovedAt != null && p.listingApprovedAt !== "";
                  const busy = isSaving;
                  return (
                    <li
                      key={p.id}
                      className='flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between'
                    >
                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='text-lg leading-none'>{p.icon}</span>
                          <span className='font-display text-[15px] font-bold'>
                            {p.name}
                          </span>
                          {p.listingStatus ? (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase",
                                listingBadgeTw(p.listingStatus),
                              )}
                            >
                              {p.listingStatus}
                            </span>
                          ) : null}
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase",
                              approved
                                ? "bg-brand-soft text-brand"
                                : "bg-sun-soft text-[#7a5a00]",
                            )}
                          >
                            {approved ? "Live on directory" : "Not approved"}
                          </span>
                        </div>
                        <p className='mt-1 text-xs leading-snug text-muted line-clamp-2'>
                          {p.description}
                        </p>
                        <p className='mt-1 text-[10px] text-muted'>
                          Posted {formatPostedAt(p.postedAt)} · {p.category} ·{" "}
                          {p.authorName}
                        </p>
                      </div>
                      <div className='flex shrink-0 flex-wrap gap-2'>
                        {approved ? (
                          <button
                            type='button'
                            disabled={busy}
                            className='cursor-pointer rounded-md border border-line bg-paper px-3 py-1.5 font-sans text-xs font-medium text-ink hover:border-flame hover:text-flame disabled:opacity-50'
                            onClick={() => void onToggle(p.id, false)}
                          >
                            Unapprove
                          </button>
                        ) : (
                          <button
                            type='button'
                            disabled={busy}
                            className='cursor-pointer rounded-md border-none bg-brand px-3 py-1.5 font-sans text-xs font-medium text-white hover:opacity-90 disabled:opacity-50'
                            onClick={() => void onToggle(p.id, true)}
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {query.hasNextPage ? (
            <div className='flex justify-center'>
              <button
                type='button'
                className='rounded-md border border-line bg-paper px-4 py-2 text-xs font-medium disabled:opacity-50'
                disabled={query.isFetchingNextPage}
                onClick={() => void query.fetchNextPage()}
              >
                {query.isFetchingNextPage ? "Loading…" : "Load more"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
