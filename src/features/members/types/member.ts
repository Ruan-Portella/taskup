import { Models } from "node-appwrite";
import { MemberRole } from "./member-roles";

export type Member = Models.Document & {
  workspaceId: string;
  userId: string;
  role: MemberRole;
}