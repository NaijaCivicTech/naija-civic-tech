export type ListingStatus = "Idea" | "Prototype" | "Live";

export type PipelineStage =
  | "suggested"
  | "accepted"
  | "building"
  | "live";

export type TeamRole =
  | "Frontend"
  | "Backend"
  | "Design"
  | "PM"
  | "Domain"
  | "Other";

export type ProjectTeamSlot = {
  userId: string;
  role: TeamRole;
};

export type TeamMember = ProjectTeamSlot & {
  name: string;
  image: string | null;
  color: string;
};

export type CivicProject = {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  category: string;
  votes: number;
  viewerHasVoted?: boolean;
  authorName: string;
  authorColor: string;
  user?: string | null;
  teams: TeamMember[];
  verified?: boolean;
  github: string | null;
  liveUrl: string | null;
  listingStatus?: ListingStatus;
  listingApprovedAt?: string | null;
  pipelineStage?: PipelineStage;
  criteria?: string[];
  postedAt: string;
  request?: string | null;
};

export type {
  CreateIdeaBody,
  CreateIdeaPayload,
  CreateListingBody,
  CreateListingPayload,
  CreateProjectAuthContext,
  CreateProjectPostBody,
} from "./create-project";
