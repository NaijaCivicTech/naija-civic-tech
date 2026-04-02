import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  parseProjectObjectId,
  toggleVoteForUser,
} from "@/lib/services/server/projects";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id: idParam } = await context.params;
  if (!parseProjectObjectId(idParam)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  let delta: unknown;
  try {
    const body = await request.json();
    delta = body?.delta;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (delta !== 1 && delta !== -1) {
    return NextResponse.json(
      { error: "delta must be 1 or -1" },
      { status: 400 },
    );
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to vote" },
      { status: 401 },
    );
  }

  try {
    const result = await toggleVoteForUser(idParam, userId, delta);
    if (!result.ok) {
      if (result.reason === "not_found") {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      const message =
        result.reason === "already_voted"
          ? "You already upvoted this project"
          : "You have not upvoted this project";
      return NextResponse.json({ error: message }, { status: 409 });
    }
    return NextResponse.json({
      votes: result.votes,
      viewerHasVoted: result.viewerHasVoted,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Vote failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
