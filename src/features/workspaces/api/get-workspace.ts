"use server";

import { DATABASE_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "@/features/members/utils/get-member";
import { Workspace } from "../types/workspace";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
  const { databases, account } = await createSessionClient();
  const user = await account.get();

  const member = await getMember({
    databases,
    userId: user.$id,
    workspaceId
  })

  if (!member) {
    throw new Error('You are not a member of this workspace');
  }

  const workspaces = await databases.getDocument<Workspace>(
    DATABASE_ID,
    WORKSPACE_ID,
    workspaceId
  );

  return workspaces;
}

export const getWorkspaceInfo = async ({ workspaceId }: { workspaceId: string }) => {
  const { databases } = await createSessionClient();

  const workspaces = await databases.getDocument<Workspace>(
    DATABASE_ID,
    WORKSPACE_ID,
    workspaceId
  );

  return {
    name: workspaces.name,
  }
}