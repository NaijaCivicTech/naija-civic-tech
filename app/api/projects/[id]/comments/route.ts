import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { jsonInternalError } from "@/lib/api-error-response";
import { checkRateLimit, clientIp } from "@/lib/rate-limit-ip";
import {
  createProjectComment,
  listProjectCommentsPage,
  normalizeCommentBody,
} from "@/lib/services/server/project-comments";
import { parseProjectObjectId } from "@/lib/services/server/projects";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id: projectId } = await context.params;
  if (!parseProjectObjectId(projectId)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const url = new URL(request.url);
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Number(limitRaw) : 30;
  const cursor = url.searchParams.get("cursor");

  try {
    const result = await listProjectCommentsPage({
      projectId,
      limit: Number.isFinite(limit) ? limit : 30,
      cursor,
    });
    if (!result.ok) {
      if (result.reason === "invalid_cursor") {
        return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
      }
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({
      comments: result.comments,
      nextCursor: result.nextCursor,
    });
  } catch (e) {
    return jsonInternalError(e, "GET /api/projects/[id]/comments");
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { id: projectId } = await context.params;
  if (!parseProjectObjectId(projectId)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to post a comment" },
      { status: 401 },
    );
  }

  const ip = clientIp(request);
  const limited = checkRateLimit(`comment:${userId}:${ip}`, 40, 60_000);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many comments. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let bodyRaw: unknown;
  try {
    const json = (await request.json()) as { body?: unknown };
    bodyRaw = json?.body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const normalized = normalizeCommentBody(bodyRaw);
  if (!normalized.ok) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  try {
    const result = await createProjectComment({
      projectId,
      userId,
      body: normalized.body,
    });
    if (!result.ok) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ comment: result.comment });
  } catch (e) {
    return jsonInternalError(e, "POST /api/projects/[id]/comments");
  }
}
