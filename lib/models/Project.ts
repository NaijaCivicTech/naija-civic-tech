import type { ListingStatus, PipelineStage, TeamRole } from "@/data/types";
import mongoose, { Schema } from "mongoose";

const TEAM_ROLES: TeamRole[] = [
  "Frontend",
  "Backend",
  "Design",
  "PM",
  "Domain",
  "Other",
];

const LISTING: ListingStatus[] = ["Idea", "Prototype", "Live"];
const PIPELINE: PipelineStage[] = ["suggested", "accepted", "building", "live"];

const projectTeamSlotSchema = new Schema(
  {
    userId: { type: String, required: true },
    role: { type: String, enum: TEAM_ROLES, required: true },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    votes: { type: Number, required: true, default: 0 },
    voterIds: { type: [String], default: [] },
    user: { type: String, default: null },
    authorEmail: { type: String, default: null, lowercase: true, trim: true },
    authorName: { type: String, required: true },
    authorColor: { type: String, required: true },
    teams: { type: [projectTeamSlotSchema], default: [] },
    verified: { type: Boolean },
    github: { type: String, default: null },
    liveUrl: { type: String, default: null },
    listingStatus: { type: String, enum: LISTING },
    listingApprovedAt: { type: Date, default: null },
    pipelineStage: { type: String, enum: PIPELINE },
    criteria: { type: [String] },
    request: { type: String, default: null },
  },
  {
    collection: "projects",
    strict: true,
    versionKey: false,
  },
);

export const ProjectModel =
  mongoose.models.Project ?? mongoose.model("Project", projectSchema);
