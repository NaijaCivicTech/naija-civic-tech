import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import {
  listListingModerationPage,
  type ListingModerationStatus,
} from "@/lib/services/server/projects";

function parseStatus(raw: string | null): ListingModerationStatus | null {
  if (raw === "pending" || raw === "approved" || raw === "all") return raw;
  return null;
}

export async function GET(request: Request) {
  const gate = await requireAdminSession();
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: gate.status },
    );
  }

  const { searchParams } = new URL(request.url);
  const status = parseStatus(searchParams.get("status"));
  if (!status) {
    return NextResponse.json(
      { error: "Invalid or missing status (pending, approved, all)" },
      { status: 400 },
    );
  }

  const limitRaw = Number(searchParams.get("limit") ?? "24");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 24;
  const cursor = searchParams.get("cursor");
  const includeTotal = cursor == null || cursor === "";

  try {
    const page = await listListingModerationPage(
      gate.session.user!.id,
      {
        status,
        limit,
        cursor: cursor || undefined,
        includeTotal,
      },
    );
    return NextResponse.json(page);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load listings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
