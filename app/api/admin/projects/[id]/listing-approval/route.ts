import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import {
  parseProjectObjectId,
  setListingApproval,
} from "@/lib/services/server/projects";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const gate = await requireAdminSession();
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  }

  const { id } = await context.params;
  if (!parseProjectObjectId(id)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const approved =
    body &&
    typeof body === "object" &&
    "approved" in body &&
    typeof (body as { approved: unknown }).approved === "boolean"
      ? (body as { approved: boolean }).approved
      : null;
  if (approved === null) {
    return NextResponse.json(
      { error: "Body must include approved: boolean" },
      { status: 400 },
    );
  }

  try {
    const result = await setListingApproval(
      id,
      approved,
      gate.session.user!.id,
    );
    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            result.reason === "not_a_listing"
              ? "Not a directory listing"
              : "Not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({ project: result.project });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update approval";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
