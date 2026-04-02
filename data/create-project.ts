import type { ListingStatus } from "./types";

export type CreateProjectAuthContext = {
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
};

export type CreateListingBody = {
  kind: "listing";
  name: string;
  tagline: string;
  description: string;
  category: string;
  status: ListingStatus;
  authorName?: string;
  authorEmail?: string;
  github: string;
  liveUrl: string;
};

export type CreateIdeaBody = {
  kind: "idea";
  problem: string;
  solution: string;
  category: string;
  criteria?: string[];
  authorName?: string;
  authorEmail?: string;
};

export type CreateProjectPostBody = CreateListingBody | CreateIdeaBody;

export type CreateListingPayload = Omit<CreateListingBody, "kind">;

export type CreateIdeaPayload = Omit<CreateIdeaBody, "kind">;
