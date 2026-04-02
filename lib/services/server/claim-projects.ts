import { normalizeEmail } from "@/lib/email";
import { connectMongoose } from "@/lib/mongoose";
import { ProjectModel } from "@/lib/models";

export async function claimProjectsForAuthorEmail(
  email: string,
  userId: string,
): Promise<number> {
  await connectMongoose();
  const normalized = normalizeEmail(email);
  const res = await ProjectModel.updateMany(
    {
      authorEmail: normalized,
      $or: [
        { user: null },
        { user: { $exists: false } },
        { user: "" },
      ],
    },
    { $set: { user: userId } },
  );
  return res.modifiedCount ?? 0;
}
