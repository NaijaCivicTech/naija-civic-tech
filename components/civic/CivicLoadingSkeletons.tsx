import { CATEGORIES } from "@/lib/civic-utils";
import { cn } from "@/lib/cn";

const pulse = "animate-pulse rounded bg-line/40";

const STAGE_LABELS = ["Suggested", "Accepted", "In Progress", "Live"] as const;

function PipelineColumnSkeleton({
  label,
  countClassWidth,
  countTint,
  cards,
  fillViewport,
}: {
  label: string;
  countClassWidth: string;
  countTint: string;
  cards: number;
  fillViewport?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg bg-paper2 p-4",
        !fillViewport && "h-full min-h-0",
        fillViewport &&
          "min-h-0 flex-1 lg:h-full lg:max-h-none lg:overflow-hidden",
      )}
    >
      <div className='mb-4 flex shrink-0 items-center justify-between'>
        <span className='font-display text-[13px] font-bold tracking-tight'>
          {label}
        </span>
        <span
          className={cn(
            "animate-pulse rounded-full px-2 py-0.5",
            countTint,
            countClassWidth,
          )}
          aria-hidden
        />
      </div>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2",
          fillViewport &&
            "scrollbar-none overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]",
        )}
      >
        {Array.from({ length: cards }, (_, i) => (
          <div
            key={i}
            className='shrink-0 rounded-md border border-line bg-card p-3.5'
          >
            <div className='mb-2 flex gap-2'>
              <div className={cn("size-6 shrink-0 rounded", pulse)} />
            </div>
            <div className={cn("mb-2 h-3.5 w-[88%] rounded", pulse)} />
            <div className={cn("mb-1 h-2.5 w-full rounded", pulse)} />
            <div className={cn("mb-3 h-2.5 w-[70%] rounded", pulse)} />
            <div className='flex items-center justify-between border-t border-line pt-2'>
              <div className={cn("h-4 w-16 rounded-full", pulse)} />
              <div
                className={cn("h-6 w-11 rounded border border-line/80", pulse)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PipelineBoardSkeleton({
  maxCardsPerColumn,
  fillViewport,
}: {
  maxCardsPerColumn?: number;
  fillViewport?: boolean;
}) {
  const cardsPerCol =
    typeof maxCardsPerColumn === "number" && maxCardsPerColumn >= 0
      ? maxCardsPerColumn
      : 4;

  const badgeWidths = ["w-6", "w-6", "w-7", "w-5"] as const;
  const badgeTints = [
    "bg-sun-soft",
    "bg-civic-blue-soft",
    "bg-flame-soft",
    "bg-brand-soft",
  ] as const;

  const gridClass = cn(
    "w-full gap-3",
    fillViewport
      ? "flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-4 lg:grid-rows-1 lg:overflow-hidden"
      : "grid grid-cols-1 items-stretch sm:grid-cols-2 lg:grid-cols-4",
  );

  return (
    <div
      className={cn(
        "w-full min-h-0",
        fillViewport && "flex h-full max-h-[70dvh] min-h-0 flex-1 flex-col",
      )}
      aria-busy='true'
      aria-label='Loading pipeline'
    >
      <div className={gridClass}>
        {STAGE_LABELS.map((label, idx) => (
          <PipelineColumnSkeleton
            key={label}
            label={label}
            countClassWidth={badgeWidths[idx] ?? "w-6"}
            countTint={badgeTints[idx] ?? "bg-brand-soft"}
            cards={cardsPerCol}
            fillViewport={fillViewport}
          />
        ))}
      </div>
    </div>
  );
}

function DirectoryCardSkeleton() {
  return (
    <div className='flex flex-col gap-2 bg-card p-[1.4rem]'>
      <div className='flex items-start justify-between gap-2'>
        <div
          className={cn(
            "size-[38px] shrink-0 rounded-lg border border-line",
            pulse,
          )}
        />
        <div className='flex gap-1'>
          <div className={cn("h-5 w-14 rounded-full", pulse)} />
          <div className={cn("h-5 w-12 rounded-full", pulse)} />
        </div>
      </div>
      <div className={cn("h-4 w-3/4 rounded", pulse)} />
      <div className='space-y-1.5'>
        <div className={cn("h-2.5 w-full rounded", pulse)} />
        <div className={cn("h-2.5 w-full rounded", pulse)} />
        <div className={cn("h-2.5 w-4/5 rounded", pulse)} />
      </div>
      <div className='mt-auto flex items-center justify-between gap-2 border-t border-line pt-2'>
        <div className='flex items-center gap-1'>
          <div className={cn("size-[18px] shrink-0 rounded-full", pulse)} />
          <div className={cn("h-2.5 w-20 rounded", pulse)} />
        </div>
        <div className='flex gap-2'>
          <div
            className={cn("h-6 w-14 rounded border border-line/80", pulse)}
          />
          <div
            className={cn("h-6 w-10 rounded border border-line/80", pulse)}
          />
        </div>
      </div>
    </div>
  );
}

export function DirectoryBoardSkeleton({
  cardCount = 6,
}: {
  cardCount?: number;
} = {}) {
  const n = Math.min(Math.max(cardCount, 1), 24);
  return (
    <div
      className='flex w-full flex-col gap-6'
      aria-busy='true'
      aria-label='Loading directory'
    >
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex flex-wrap gap-1'>
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              type='button'
              className={cn(
                "cursor-pointer rounded-full! border-[1.5px] border-line bg-transparent px-[13px] py-1.5 font-sans text-[11px] font-medium text-muted transition-all hover:border-ink hover:text-ink",
                pulse,
              )}
            >
              <span className='invisible'>
                {cat === "all" ? "All Tools" : cat}
              </span>
            </button>
          ))}
        </div>
        <div className='flex items-center gap-1.5 rounded-md border-[1.5px] border-line bg-card px-3 py-1.5'>
          <div className={cn("size-3.5 rounded", pulse)} />
          <div
            className={cn("h-3 w-[180px] max-sm:w-[140px] rounded", pulse)}
          />
        </div>
      </div>
      <div className={cn("h-3 w-36 rounded", pulse)} />
      <div className='grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:[grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]'>
        {Array.from({ length: n }, (_, i) => (
          <DirectoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** Matches project detail modal layout in CivicModals (header, body, tags, discussion). */
export function ProjectDetailModalSkeleton() {
  return (
    <div aria-busy='true' aria-label='Loading project'>
      <div className='mb-6 flex flex-col md:flex-row gap-4 border-b border-line pb-6'>
        <div
          className={cn(
            "size-[52px] shrink-0 rounded-[10px] border border-line",
            pulse,
          )}
        />
        <div className='min-w-0 flex-1 space-y-3'>
          <div className={cn("h-5 w-[72%] max-w-md rounded", pulse)} />
          <div className='flex w-full items-center justify-between gap-3'>
            <div className={cn("h-2.5 w-24 rounded", pulse)} />
            <div className='flex min-w-0 items-center justify-end gap-2'>
              <div className={cn("size-5 shrink-0 rounded-full", pulse)} />
              <div className={cn("h-2.5 w-20 rounded", pulse)} />
            </div>
          </div>
          <div className='rounded-lg border border-line bg-paper px-4 py-3'>
            <div className={cn("mb-2 h-2.5 w-16 rounded", pulse)} />
            <div className='space-y-1.5'>
              <div className={cn("h-3 w-full rounded", pulse)} />
              <div className={cn("h-3 w-[92%] rounded", pulse)} />
            </div>
          </div>
          <div className={cn("h-2.5 w-28 rounded", pulse)} />
          <div className='space-y-2'>
            <div className={cn("h-3 w-full rounded", pulse)} />
            <div className={cn("h-3 w-full rounded", pulse)} />
            <div className={cn("h-3 w-[88%] rounded", pulse)} />
            <div className={cn("h-3 w-[64%] rounded", pulse)} />
          </div>
          <div className='flex flex-wrap gap-1.5 pt-0.5'>
            <div className={cn("h-5 w-20 rounded-full", pulse)} />
            <div className={cn("h-5 w-16 rounded-full", pulse)} />
            <div className={cn("h-5 w-24 rounded-full", pulse)} />
          </div>
        </div>
      </div>
      <div className='border-t border-line pt-6'>
        <div className={cn("mb-4 h-2.5 w-24 rounded", pulse)} />
        <div
          className={cn(
            "mb-2 h-[88px] w-full rounded-md border border-line",
            pulse,
          )}
        />
        <div className='flex justify-end'>
          <div className={cn("h-9 w-28 rounded-md", pulse)} />
        </div>
        <div className='mt-6 flex flex-col gap-4'>
          <div className='rounded-lg border border-line bg-paper px-3.5 py-3'>
            <div className='mb-2 flex items-center gap-2'>
              <div className={cn("size-[18px] shrink-0 rounded-full", pulse)} />
              <div className='space-y-1'>
                <div className={cn("h-3 w-28 rounded", pulse)} />
                <div className={cn("h-2 w-20 rounded", pulse)} />
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className={cn("h-3 w-full rounded", pulse)} />
              <div className={cn("h-3 w-[90%] rounded", pulse)} />
            </div>
          </div>
          <div className='rounded-lg border border-line bg-paper px-3.5 py-3'>
            <div className='mb-2 flex items-center gap-2'>
              <div className={cn("size-[18px] shrink-0 rounded-full", pulse)} />
              <div className='space-y-1'>
                <div className={cn("h-3 w-24 rounded", pulse)} />
                <div className={cn("h-2 w-16 rounded", pulse)} />
              </div>
            </div>
            <div className={cn("h-3 w-4/5 rounded", pulse)} />
          </div>
        </div>
      </div>
    </div>
  );
}
