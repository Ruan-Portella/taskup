import { BUCKET_ID, DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils/get-member";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema } from "../schemas/create";
import { updateProjectSchema } from "../schemas/update";
import { Project } from "../types/project";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');

      const { workspaceId } = c.req.valid('query');

      const member = await getMember({ databases, workspaceId, userId: user.$id });

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const projects = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.orderDesc('$createdAt')
        ]
      )

      return c.json({ data: projects })
    }
  )
  .get(
    '/:projectId',
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases');
      const user = c.get('user');
      const { projectId } = c.req.param();

      const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: project.workspaceId
      })

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      return c.json({ data: project })
    }
  )
  .get(
    '/:projectId/analytics',
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases');
      const user = c.get('user');
      const { projectId } = c.req.param();

      const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: project.workspaceId
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
          Query.equal('projectId', projectId),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]
      )

      const lastMonthTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
        ]
      )

      const taskDifference = thisMonthTask.total - lastMonthTask.total;

      const thisMonthAssignedTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.equal('assigneeId', member.$id),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]
      )

      const lastMonthAssignedTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.equal('assigneeId', member.$id),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]
      )

      const assignedTaskDifference = thisMonthAssignedTask.total - lastMonthAssignedTask.total;
      
      const thisMonthIncompleteTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.notEqual('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]
      )

      const lastMonthIncompleteTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.notEqual('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]
      )

      const incompleteTaskDifference = thisMonthIncompleteTask.total - lastMonthIncompleteTask.total;

      const thisMonthCompleteTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.equal('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]
      )

      const lastMonthCompleteTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.equal('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]
      )

      const completeTaskDifference = thisMonthCompleteTask.total - lastMonthCompleteTask.total;

      const thisMonthOverdueTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.notEqual('status', TaskStatus.DONE),
          Query.lessThan('dueDate', now.toISOString()),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]
      )

      const lastMonthOverdueTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.notEqual('status', TaskStatus.DONE),
          Query.lessThan('dueDate', now.toISOString()),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]
      )

      const overdueTaskDifference = thisMonthOverdueTask.total - lastMonthOverdueTask.total;

      return c.json({ data: {
        taskCount: thisMonthTask.total,
        taskDifference,
        assignedTaskCount: thisMonthAssignedTask.total,
        assignedTaskDifference,
        incompleteTaskCount: thisMonthIncompleteTask.total,
        incompleteTaskDifference,
        completeTaskCount: thisMonthCompleteTask.total,
        completeTaskDifference,
        overdueTaskCount: thisMonthOverdueTask.total,
        overdueTaskDifference
      }})
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('form', createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId } = c.req.valid('form');

      const member = await getMember({ databases, workspaceId, userId: user.$id });

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
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

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId
        }
      )

      return c.json({ data: project })
    }
  )
  .patch(
    '/:projectId',
    sessionMiddleware,
    zValidator('form', updateProjectSchema),
    async (c) => {
      const databases = c.get('databases');
      const storage = c.get('storage');
      const user = c.get('user');

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid('form');

      const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: existingProject.workspaceId
      })

      if (!member) {
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

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl
        }
      )

      return c.json({ data: project })
    }
  )  
  .delete(
      "/:projectId",
      sessionMiddleware,
      async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");
        const { projectId } = c.req.param();

        const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);
  
        const member = await getMember({
          databases,
          userId: user.$id,
          workspaceId: existingProject.workspaceId
        })
  
        if (!member) {
          return c.json({error: 'Unauthorized'}, 401)
        }
  
        await databases.deleteDocument(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        )
  
        return c.json({ data: { $id: projectId } });
      }
    )

export default app;