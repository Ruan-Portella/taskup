import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas/create";
import { sessionMiddleware } from "@/lib/session-middleware";
import { BUCKET_ID, DATABASE_ID, MEMBERS_ID, TASKS_ID, WORKSPACE_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types/member-roles";
import { generateInviteCode } from "@/lib/utils";
import { updateWorkspaceSchema } from "../schemas/update";
import { getMember } from "@/features/members/utils/get-member";
import { z } from "zod";
import { Workspace } from "../types/workspace";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get('/',
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal('userId', user.$id)]
      );

      if (members.total === 0) {
        return c.json({ data: { documents: [], total: 0 } })
      }

      const workspacesIds = members.documents.map((member) => member.workspaceId);

      const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACE_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.contains('$id', workspacesIds)
        ]
      );

      return c.json({ data: workspaces })
    }
  )
  .get(
    '/:workspaceId',
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId
      )

      return c.json({ data: workspace })
    }
  )
  .get(
    '/:workspaceId/info',
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })

      if (member) {
        return c.json({ error: 'Already a member' }, 400)
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId
      )

      return c.json({
        data: {
          $id: workspace.$id,
          name: workspace.name,
          imageUrl: workspace.imageUrl
        }
      })
    }
  )
  .get(
    '/:workspaceId/analytics',
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases');
      const user = c.get('user');
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: workspaceId
      })

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      const thisMonthTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
          Query.isNull('parentTaskId')
        ]
      )

      const lastMonthTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
          Query.isNull('parentTaskId')
        ]
      )

      const taskDifference = thisMonthTask.total - lastMonthTask.total;

      const thisMonthAssignedTask = thisMonthTask.documents.filter(task => task.assigneeId === member.$id).length;

      const lastMonthAssignedTask = lastMonthTask.documents.filter(task => task.assigneeId === member.$id).length;

      const assignedTaskDifference = thisMonthAssignedTask - lastMonthAssignedTask;

      const thisMonthIncompleteTask = thisMonthTask.documents.filter(task => task.status !== TaskStatus.DONE).length;


      const lastMonthIncompleteTask = lastMonthTask.documents.filter(task => task.status !== TaskStatus.DONE).length;

      const incompleteTaskDifference = thisMonthIncompleteTask - lastMonthIncompleteTask;

      const thisMonthCompleteTask = thisMonthTask.documents.filter(task => task.status === TaskStatus.DONE).length;

      const lastMonthCompleteTask = lastMonthTask.documents.filter(task => task.status === TaskStatus.DONE).length;

      const completeTaskDifference = thisMonthCompleteTask - lastMonthCompleteTask;


      const thisMonthOverdueTask = thisMonthTask.documents.filter(task => task.status !== TaskStatus.DONE && new Date(task.dueDate) < now).length;

      const lastMonthOverdueTask = lastMonthTask.documents.filter(task => task.status !== TaskStatus.DONE && new Date(task.dueDate) < now).length;

      const overdueTaskDifference = thisMonthOverdueTask - lastMonthOverdueTask;

      return c.json({
        data: {
          taskCount: thisMonthTask.total,
          taskDifference,
          assignedTaskCount: thisMonthAssignedTask,
          assignedTaskDifference,
          incompleteTaskCount: thisMonthIncompleteTask,
          incompleteTaskDifference,
          completeTaskCount: thisMonthCompleteTask,
          completeTaskDifference,
          overdueTaskCount: thisMonthOverdueTask,
          overdueTaskDifference
        }
      })
    }
  )
  .post(
    '/',
    zValidator('form', createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid('form');

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          BUCKET_ID,
          file.$id
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
      } else {
        uploadedImageUrl = image;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6)
        }
      )

      await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN
        }
      )

      return c.json({ data: workspace })
    }
  )
  .patch(
    '/:workspaceId',
    sessionMiddleware,
    zValidator('form', updateWorkspaceSchema),
    async (c) => {
      const databases = c.get('databases');
      const storage = c.get('storage');
      const user = c.get('user');

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid('form');

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          BUCKET_ID,
          file.$id
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
      } else {
        uploadedImageUrl = image;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl
        }
      )

      return c.json({ data: workspace })
    }
  )
  .delete(
    "/:workspaceId",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      // Delete all members, projects, tasks

      await databases.deleteDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId
      )

      return c.json({ data: { $id: workspaceId } });
    }
  )
  .post(
    "/:workspaceId/reset-invite-code",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
        {
          inviteCode: generateInviteCode(6)
        }
      )

      return c.json({ data: workspace });
    }
  )
  .post(
    '/:workspaceId/join',
    sessionMiddleware,
    zValidator('json', z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid('json');

      const databases = c.get('databases');
      const user = c.get('user');

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId
      })

      if (member) {
        return c.json({ error: 'Already a member' }, 400)
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code) {
        return c.json({ error: 'Invalid code' }, 400)
      }

      await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId,
          role: MemberRole.MEMBER
        }
      )

      return c.json({ data: workspace })
    }
  )

export default app;