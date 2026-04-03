"use client";

import { AuthorAvatar } from "@/components/civic/AuthorAvatar";
import {
  usePostProjectCommentMutation,
  useProjectComments,
} from "@/hooks/use-civic-project-comments";
import { formatPostedAt } from "@/lib/civic-utils";
import { cn } from "@/lib/cn";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";

const fieldInput =
  "w-full rounded-md border-[1.5px] border-line bg-paper px-3.5 py-2 font-sans text-[13px] text-ink outline-none transition-colors focus:border-brand";

type ProjectCommentsSectionProps = {
  projectId: string;
};

export function ProjectCommentsSection({
  projectId,
}: ProjectCommentsSectionProps) {
  const { data: session, status } = useSession();
  const isSignedIn = Boolean(session?.user?.id);
  const commentsQ = useProjectComments(
    projectId,
    Boolean(projectId) && status !== "loading",
  );
  const postM = usePostProjectCommentMutation(projectId);
  const [draft, setDraft] = useState("");

  const flat = useMemo(
    () => commentsQ.data?.pages.flatMap((p) => p.comments) ?? [],
    [commentsQ.data?.pages],
  );

  const errorMsg =
    commentsQ.isError && commentsQ.error instanceof Error
      ? commentsQ.error.message
      : null;

  return (
    <div className='pt-6'>
      <h4 className='mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted'>
        Discussion
      </h4>
      {!isSignedIn ? (
        <p className='mb-4 text-[12px] font-light leading-relaxed text-muted'>
          Public thread for this project. Sign in to add a comment.
        </p>
      ) : null}

      {isSignedIn ? (
        <form
          className='mb-6'
          onSubmit={(e) => {
            e.preventDefault();
            const t = draft.trim();
            if (!t || postM.isPending) return;
            postM.mutate(t, {
              onSuccess: () => setDraft(""),
              onError: (err) => {
                window.alert(
                  err instanceof Error
                    ? err.message
                    : "Could not post comment.",
                );
              },
            });
          }}
        >
          <label className='sr-only' htmlFor={`project-comment-${projectId}`}>
            Your comment
          </label>
          <textarea
            id={`project-comment-${projectId}`}
            className={cn(fieldInput, "mb-2 min-h-[88px] resize-y")}
            placeholder='Ask a question, offer help, or share context…'
            maxLength={2000}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={postM.isPending}
          />
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <span className='text-[11px] text-muted'>{draft.length}/2000</span>
            <button
              type='submit'
              className={cn(
                "cursor-pointer rounded-md border-none bg-ink px-4 py-2 font-sans text-[12px] font-medium text-paper transition-opacity",
                "hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50",
              )}
              disabled={postM.isPending || !draft.trim()}
            >
              {postM.isPending ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className='mb-6 rounded-md border border-dashed border-line bg-paper px-4 py-3 text-[13px] text-muted'>
          <Link
            href='/login'
            className='font-medium text-brand no-underline hover:underline'
          >
            Sign in
          </Link>{" "}
          to join the discussion.
        </p>
      )}

      {commentsQ.isPending ? (
        <p className='text-[13px] text-muted'>Loading comments…</p>
      ) : errorMsg ? (
        <p className='text-[13px] text-flame'>{errorMsg}</p>
      ) : flat.length === 0 ? (
        <p className='text-[13px] text-muted'>No comments yet.</p>
      ) : (
        <ul className='flex flex-col gap-4'>
          {flat.map((c) => (
            <li
              key={c.id}
              className='rounded-lg border border-line bg-paper px-3.5 py-3'
            >
              <div className='mb-2 flex items-start justify-between gap-2'>
                <div className='flex min-w-0 items-center gap-2'>
                  <AuthorAvatar
                    name={c.authorName}
                    color={c.authorColor}
                    image={c.authorImage}
                    size='sm'
                  />
                  <div className='min-w-0'>
                    <div className='truncate text-[13px] font-medium text-ink'>
                      {c.authorName}
                    </div>
                    <div className='text-[10px] text-muted'>
                      {formatPostedAt(c.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              <p className='whitespace-pre-wrap text-[13px] leading-relaxed text-ink'>
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      {commentsQ.hasNextPage ? (
        <div className='mt-4 flex justify-center'>
          <button
            type='button'
            className='rounded-md border-[1.5px] border-line bg-transparent px-4 py-2 font-sans text-[12px] font-medium text-ink transition-colors hover:border-ink disabled:cursor-wait disabled:opacity-60'
            disabled={commentsQ.isFetchingNextPage}
            onClick={() => void commentsQ.fetchNextPage()}
          >
            {commentsQ.isFetchingNextPage ? "Loading…" : "Load older comments"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
