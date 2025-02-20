import { Models } from "node-appwrite";

export type Category = Models.Document & {
  name: string;
  workspaceId: string;
}