"use server";

import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "@/features/auth/server/route";
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "@/features/members/utils/get-member";
import { Workspace } from "../types/workspace";

export const getWorkspace = async ({workspaceId}: {workspaceId: string}) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
  
    const cookie = await cookies()
  
    const session = cookie.get(AUTH_COOKIE);
  
    if (!session) {
      return null;
    }

    client.setSession(session.value);
    
    const databases = new Databases(client);
    const account = new Account(client);

    const user = await account.get();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId
    })

    if (!member) {
      return null;
    }

    const workspaces = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
    );

    return workspaces;
  } catch {
    return null;
  }
}