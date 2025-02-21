import { Models } from "node-appwrite";

export type Category = Models.Document & {
  name: string;
  color: string;
  workspaceId: string;
}