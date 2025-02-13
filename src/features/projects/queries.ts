"use server";

import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils/get-member";
import { createSessionClient } from "@/lib/appwrite";
import { Project } from "./types/project";

export const getProject = async ({ projectId }: { projectId: string }) => {
  const { databases, account } = await createSessionClient();
  const user = await account.get();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  const member = await getMember({
    databases,
    userId: user.$id,
    workspaceId: project.workspaceId
  })

  if (!member) {
    throw new Error('Você não tem permissão para acessar este projeto');
  }

  return project;
}