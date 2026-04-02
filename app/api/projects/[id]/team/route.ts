import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { TeamRole } from "@/data/types";
import {
  isTeamRole,
  parseProjectObjectId,
  pushTeamMember,
} from "@/lib/services/server/projects";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id: idParam } = await context.params;
  if (!parseProjectObjectId(idParam)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to join a team" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  if (!isTeamRole(o.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const role = o.role as TeamRole;

  try {
    const result = await pushTeamMember(idParam, { userId, role }, userId);
    if (!result.ok) {
      if (result.reason === "duplicate") {
        return NextResponse.json(
          { error: "You are already on this team" },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ project: result.project });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
