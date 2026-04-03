import type { ProjectComment } from "@/data/types";
import { avatarColorFromSeed } from "@/lib/civic-utils";
import { connectMongoose } from "@/lib/mongoose";
import { ProjectCommentModel, ProjectModel, UserModel } from "@/lib/models";
import mongoose from "mongoose";
import { parseProjectObjectId } from "@/lib/services/server/projects";

const BODY_MAX = 2000;

type UserBrief = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

function displayNameForUserId(
  userId: string,
  byId: Map<string, UserBrief>,
): string {
  const u = byId.get(userId);
  if (!u) return "Member";
  const n = typeof u.name === "string" ? u.name.trim() : "";
  if (n) return n;
  const em = typeof u.email === "string" ? u.email.trim() : "";
  if (em.includes("@")) {
    const local = em.split("@")[0]?.trim();
    if (local) return local;
  }
  return "Member";
}

async function fetchUserMap(hexIds: string[]): Promise<Map<string, UserBrief>> {
  const map = new Map<string, UserBrief>();
  const unique = [...new Set(hexIds)];
  if (unique.length === 0) return map;
  await connectMongoose();
  const oids = unique
    .map((id) => parseProjectObjectId(id))
    .filter((x): x is mongoose.Types.ObjectId => x != null);
  if (oids.length === 0) return map;
  const users = await UserModel.find({ _id: { $in: oids } })
    .select("name email image")
    .lean()
    .exec();
  for (const u of users) {
    const id =
      u._id instanceof mongoose.Types.ObjectId
        ? u._id.toHexString()
        : String(u._id);
    map.set(id, {
      name: u.name,
      email: u.email,
      image: u.image,
    });
  }
  return map;
}

export function normalizeCommentBody(
  raw: unknown,
): { ok: true; body: string } | { ok: false; error: string } {
  if (typeof raw !== "string") {
    return { ok: false, error: "body must be a string" };
  }
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (trimmed.length === 0) {
    return { ok: false, error: "Comment cannot be empty" };
  }
  if (trimmed.length > BODY_MAX) {
    return {
      ok: false,
      error: `Comment must be ${BODY_MAX} characters or less`,
    };
  }
  return { ok: true, body: trimmed };
}

function docToDto(
  doc: {
    _id: mongoose.Types.ObjectId;
    userId: string;
    body: string;
    createdAt?: Date;
  },
  userMap: Map<string, UserBrief>,
): ProjectComment {
  const userId = doc.userId.trim();
  const image = userMap.get(userId)?.image ?? null;
  return {
    id: doc._id.toHexString(),
    userId,
    body: doc.body,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : new Date().toISOString(),
    authorName: displayNameForUserId(userId, userMap),
    authorColor: avatarColorFromSeed(userId),
    authorImage: image,
  };
}

export async function listProjectCommentsPage(params: {
  projectId: string;
  limit: number;
  cursor?: string | null;
}): Promise<
  | { ok: true; comments: ProjectComment[]; nextCursor: string | null }
  | { ok: false; reason: "invalid_project" | "invalid_cursor" }
> {
  const projectOid = parseProjectObjectId(params.projectId);
  if (!projectOid) return { ok: false, reason: "invalid_project" };

  const limit = Math.min(50, Math.max(1, Math.floor(params.limit)));
  let cursorOid: mongoose.Types.ObjectId | null = null;
  if (params.cursor != null && params.cursor !== "") {
    cursorOid = parseProjectObjectId(params.cursor);
    if (!cursorOid) return { ok: false, reason: "invalid_cursor" };
  }

  await connectMongoose();
  const exists = await ProjectModel.exists({ _id: projectOid }).exec();
  if (!exists) return { ok: false, reason: "invalid_project" };

  const filter: Record<string, unknown> = { projectId: projectOid };
  if (cursorOid) {
    filter._id = { $lt: cursorOid };
  }

  const docs = await ProjectCommentModel.find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean()
    .exec();

  const slice = docs.slice(0, limit);
  const hasMore = docs.length > limit;
  const last = slice[slice.length - 1];
  const nextCursor =
    hasMore && last && last._id instanceof mongoose.Types.ObjectId
      ? last._id.toHexString()
      : null;

  const userIds = slice.map((d) => String(d.userId).trim()).filter(Boolean);
  const userMap = await fetchUserMap(userIds);
  const comments = slice.map((d) => {
    const rawCreated = d.createdAt;
    const createdAt =
      rawCreated instanceof Date
        ? rawCreated
        : typeof rawCreated === "string" || typeof rawCreated === "number"
          ? new Date(rawCreated)
          : new Date();
    return docToDto(
      {
        _id: d._id as mongoose.Types.ObjectId,
        userId: String(d.userId),
        body: String(d.body),
        createdAt,
      },
      userMap,
    );
  });

  return { ok: true, comments, nextCursor };
}

export async function createProjectComment(params: {
  projectId: string;
  userId: string;
  body: string;
}): Promise<
  | { ok: true; comment: ProjectComment }
  | { ok: false; reason: "project_not_found" }
> {
  const projectOid = parseProjectObjectId(params.projectId);
  if (!projectOid) {
    return { ok: false, reason: "project_not_found" };
  }

  await connectMongoose();
  const exists = await ProjectModel.exists({ _id: projectOid }).exec();
  if (!exists) return { ok: false, reason: "project_not_found" };

  const doc = await ProjectCommentModel.create({
    projectId: projectOid,
    userId: params.userId.trim(),
    body: params.body,
  });

  const userMap = await fetchUserMap([params.userId]);
  const comment = docToDto(
    {
      _id: doc._id as mongoose.Types.ObjectId,
      userId: doc.userId,
      body: doc.body,
      createdAt: doc.createdAt,
    },
    userMap,
  );

  return { ok: true, comment };
}
