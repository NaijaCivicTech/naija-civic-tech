import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createIdeaFromBody,
  createListingFromBody,
  parseCreateIdeaBody,
  parseCreateListingBody,
} from "@/lib/api/create-project";
import {
  getProjectsStats,
  listProjectsPage,
  type ProjectListSort,
} from "@/lib/services/server/projects";

function parseSort(raw: string | null): ProjectListSort | undefined {
  if (raw === "latest" || raw === "oldest" || raw === "votes") return raw;
  return undefined;
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    const viewerId = session?.user?.id ?? null;
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");

    if (scope === "stats") {
      const stats = await getProjectsStats();
      return NextResponse.json({ stats });
    }

    if (scope === "directory" || scope === "pipeline") {
      const limitRaw = Number(searchParams.get("limit") ?? "24");
      const limit = Number.isFinite(limitRaw) ? limitRaw : 24;
      const cursor = searchParams.get("cursor");
      const sort = parseSort(searchParams.get("sort"));
      const category = searchParams.get("category");
      const q = searchParams.get("q");
      const includeTotal = cursor == null || cursor === "";

      const page = await listProjectsPage(viewerId, {
        scope,
        limit,
        cursor: cursor || undefined,
        sort,
        category: category || undefined,
        search: q || undefined,
        includeTotal,
      });
      return NextResponse.json(page);
    }

    return NextResponse.json(
      { error: "Missing or invalid scope (use stats, directory, or pipeline)" },
      { status: 400 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;
    const userEmail = session?.user?.email ?? null;
    const userName = session?.user?.name ?? null;
    const authCtx = { userId, userEmail, userName };

    const body: unknown = await request.json();
    const kind =
      body && typeof body === "object" && "kind" in body
        ? (body as { kind?: unknown }).kind
        : undefined;

    if (kind === "listing") {
      const project = await createListingFromBody(
        parseCreateListingBody(body),
        authCtx,
      );
      return NextResponse.json({ project }, { status: 201 });
    }
    if (kind === "idea") {
      const project = await createIdeaFromBody(
        parseCreateIdeaBody(body),
        authCtx,
      );
      return NextResponse.json({ project }, { status: 201 });
    }

    return NextResponse.json(
      { error: "Unsupported kind; use listing or idea" },
      { status: 400 },
    );
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to create project";
    const status =
      message.startsWith("Expected") ||
      message.includes("required") ||
      message === "Invalid body"
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
