"use client";

import { PipelineBoardSkeleton } from "@/components/civic/CivicLoadingSkeletons";
import type { CivicProject, PipelineStage } from "@/data/types";
import {
  useHomePipelinePreview,
  usePipelineProjectsInfinite,
} from "@/hooks/use-civic-feeds";
import { useCivicVote } from "@/hooks/use-civic-vote";
import { formatPostedAt } from "@/lib/civic-utils";
import { civicModalStore } from "@/lib/civic-modal-store";
import { cn } from "@/lib/cn";
import { useId, useMemo, useState } from "react";

export type PipelineSortMode = "latest" | "oldest" | "votes";

function sortColumnItems(
  items: CivicProject[],
  mode: PipelineSortMode,
): CivicProject[] {
  const copy = [...items];
  if (mode === "votes") {
    copy.sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return b.id.localeCompare(a.id);
    });
  } else if (mode === "oldest") {
    copy.sort((a, b) => a.id.localeCompare(b.id));
  } else {
    copy.sort((a, b) => b.id.localeCompare(a.id));
  }
  return copy;
}

const STAGES: {
  key: PipelineStage;
  label: string;
  countClass: keyof typeof COL_COUNT_TW;
}[] = [
  { key: "suggested", label: "Suggested", countClass: "suggested" },
  { key: "accepted", label: "Accepted", countClass: "accepted" },
  { key: "building", label: "In Progress", countClass: "building" },
  { key: "live", label: "Live", countClass: "live" },
];

const COL_COUNT_TW = {
  suggested: "bg-sun-soft text-[#7a5a00]",
  accepted: "bg-civic-blue-soft text-civic-blue",
  building: "bg-flame-soft text-flame",
  live: "bg-brand-soft text-brand",
} as const;

const verifiedTw =
  "inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/20 bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand";

function PipelineCard({
  project: p,
  voted,
  canVote,
  onVote,
}: {
  project: CivicProject;
  voted: boolean;
  canVote: boolean;
  onVote: () => void;
}) {
  const openDetail = () => civicModalStore.openProject(p.id);

  return (
    <div className='flex w-full shrink-0 gap-2 rounded-md border border-line bg-card p-3.5 text-left font-[inherit] text-inherit transition-all'>
      <button
        type='button'
        className='min-w-0 flex-1 cursor-pointer border-none bg-transparent p-0 text-left font-[inherit] text-inherit outline-none focus-visible:ring-2 focus-visible:ring-sun focus-visible:ring-offset-2 focus-visible:ring-offset-card'
        onClick={openDetail}
        aria-label={`Open details: ${p.name}`}
      >
        <div className='mb-1.5 flex flex-wrap items-center gap-2'>
          <div className='text-lg leading-none'>{p.icon}</div>
          {p.verified ? <span className={verifiedTw}>✓ Verified</span> : null}
        </div>
        <div className='mb-1 font-display text-[13px] font-bold tracking-tight'>
          {p.name}
        </div>
        <div className='mb-1.5 text-[10px] text-muted'>
          Posted {formatPostedAt(p.postedAt)}
        </div>
        {p.request?.trim() ? (
          <div className='mb-1.5 rounded border border-line/70 bg-paper/60 px-2 py-1.5'>
            <div className='text-[9px] font-semibold uppercase tracking-wider text-muted'>
              Request
            </div>
            <p className='line-clamp-2 text-[11px] leading-snug text-ink'>
              {p.request.trim()}
            </p>
          </div>
        ) : null}
        <div className='text-[11px] font-light leading-snug text-muted'>
          {p.request?.trim() ? (
            <>
              <span className='font-medium text-ink/80'>Approach · </span>
              {p.description}
            </>
          ) : (
            p.description
          )}
        </div>
        <div className='mt-2 border-t border-line pt-2'>
          <span className='rounded-full border border-line bg-paper px-[7px] py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted'>
            {p.category}
          </span>
        </div>
      </button>
      <div className='flex shrink-0 flex-col justify-end'>
        <button
          type='button'
          disabled={!canVote}
          title={canVote ? undefined : "Sign in to vote"}
          className={cn(
            "rounded border border-line bg-transparent px-[7px] py-0.5 font-sans text-[11px] font-semibold text-muted transition-colors",
            canVote && "hover:border-flame hover:text-flame",
            !canVote && "cursor-not-allowed opacity-60",
            voted &&
              canVote &&
              "border-flame bg-flame text-white hover:bg-flame",
          )}
          onClick={() => {
            if (canVote) onVote();
          }}
        >
          ▲ {p.votes}
        </button>
      </div>
    </div>
  );
}

const sortSelectTw =
  "min-w-[140px] cursor-pointer rounded-md border-[1.5px] border-line bg-paper px-2.5 py-1.5 font-sans text-xs text-ink outline-none transition-colors focus:border-brand";

export type PipelineStageCounts = Partial<
  Record<PipelineStage, number>
> | null;

type PipelineBoardProps = {
  maxCardsPerColumn?: number;
  fillViewport?: boolean;
  hideSort?: boolean;
  stageCounts?: PipelineStageCounts;
};

export function PipelineBoard({
  maxCardsPerColumn,
  fillViewport,
  hideSort = false,
  stageCounts: stageCountsProp,
}: PipelineBoardProps = {}) {
  const [sortMode, setSortMode] = useState<PipelineSortMode>("latest");
  const isEmbeddedHome =
    typeof maxCardsPerColumn === "number" &&
    maxCardsPerColumn >= 0 &&
    hideSort;

  const previewQ = useHomePipelinePreview(isEmbeddedHome);
  const infiniteQ = usePipelineProjectsInfinite(sortMode, !isEmbeddedHome);

  const projects = useMemo(() => {
    if (isEmbeddedHome) {
      return previewQ.data?.projects ?? [];
    }
    return infiniteQ.data?.pages.flatMap((p) => p.projects) ?? [];
  }, [isEmbeddedHome, previewQ.data?.projects, infiniteQ.data?.pages]);

  const projectsLoading = isEmbeddedHome
    ? previewQ.isPending
    : infiniteQ.isPending;
  const projectsError = isEmbeddedHome
    ? previewQ.isError
      ? previewQ.error instanceof Error
        ? previewQ.error.message
        : "Failed to load projects"
      : null
    : infiniteQ.isError
      ? infiniteQ.error instanceof Error
        ? infiniteQ.error.message
        : "Failed to load projects"
      : null;

  const { canVote, toggleVote } = useCivicVote();
  const sortControlId = useId();

  if (projectsLoading) {
    return (
      <PipelineBoardSkeleton
        maxCardsPerColumn={maxCardsPerColumn}
        fillViewport={fillViewport}
      />
    );
  }
  if (projectsError) {
    return (
      <p className='rounded-lg border border-flame/30 bg-flame-soft px-4 py-3 text-sm text-flame'>
        {projectsError}
      </p>
    );
  }

  const gridClass = cn(
    "w-full gap-3",
    fillViewport
      ? "flex min-h-0 max-h-[70dvh] flex-1 flex-col lg:grid lg:max-h-full lg:grid-cols-4 lg:grid-rows-1 lg:overflow-hidden"
      : "grid grid-cols-1 items-start sm:grid-cols-2 lg:grid-cols-4",
  );

  return (
    <div
      className={cn(
        "w-full min-h-0",
        fillViewport && "flex h-full min-h-0 max-h-[70dvh] flex-1 flex-col",
      )}
    >
      {!hideSort ? (
        <div className='mb-3 flex flex-wrap items-center justify-end gap-2'>
          <label
            htmlFor={sortControlId}
            className='text-[11px] font-medium uppercase tracking-[0.07em] text-muted'
          >
            Sort columns
          </label>
          <select
            id={sortControlId}
            className={sortSelectTw}
            value={sortMode}
            onChange={(e) =>
              setSortMode(e.target.value as PipelineSortMode)
            }
            aria-label='Sort pipeline columns'
          >
            <option value='latest'>Latest first</option>
            <option value='oldest'>Oldest first</option>
            <option value='votes'>Most votes</option>
          </select>
        </div>
      ) : null}
      <div className={gridClass}>
        {STAGES.map((stage) => {
          const columnItems = projects.filter(
            (p) => p.pipelineStage === stage.key,
          );
          const sorted = sortColumnItems(columnItems, sortMode);
          const cap =
            typeof maxCardsPerColumn === "number" && maxCardsPerColumn >= 0
              ? maxCardsPerColumn
              : null;
          const items = cap != null ? sorted.slice(0, cap) : sorted;
          const badgeCount =
            stageCountsProp?.[stage.key] ?? columnItems.length;
          return (
            <div
              key={stage.key}
              className={cn(
                "flex flex-col rounded-lg bg-paper2 p-4",
                fillViewport &&
                  "min-h-0 max-h-[min(45dvh,80dvh)] shrink-0 sm:max-h-[min(50dvh,100dvh)] lg:h-full lg:max-h-none lg:overflow-hidden",
              )}
            >
              <div className='mb-4 flex shrink-0 items-center justify-between'>
                <span className='font-display text-[13px] font-bold tracking-tight'>
                  {stage.label}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    COL_COUNT_TW[stage.countClass],
                  )}
                >
                  {badgeCount}
                </span>
              </div>
              <div
                className={cn(
                  "flex flex-col gap-2",
                  fillViewport &&
                    "scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]",
                )}
              >
                {items.map((p) => (
                  <PipelineCard
                    key={p.id}
                    project={p}
                    voted={p.viewerHasVoted === true}
                    canVote={canVote}
                    onVote={() => toggleVote(p.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {!isEmbeddedHome && infiniteQ.hasNextPage ? (
        <div className='mt-4 flex justify-center'>
          <button
            type='button'
            className='rounded-md border-[1.5px] border-line bg-paper px-5 py-2 font-sans text-xs font-medium text-ink transition-colors hover:border-ink disabled:cursor-wait disabled:opacity-60'
            disabled={infiniteQ.isFetchingNextPage}
            onClick={() => void infiniteQ.fetchNextPage()}
          >
            {infiniteQ.isFetchingNextPage ? "Loading…" : "Load more pipeline"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
