import mongoose, { Schema } from "mongoose";

const projectCommentSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: { type: String, required: true, trim: true },
    body: { type: String, required: true },
  },
  {
    collection: "project_comments",
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

projectCommentSchema.index({ projectId: 1, _id: -1 });

export const ProjectCommentModel =
  mongoose.models.ProjectComment ??
  mongoose.model("ProjectComment", projectCommentSchema);
