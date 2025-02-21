import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "@/features/members/utils/get-member";
import { CATEGORIES_ID, DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "@/features/projects/types/project";
import { Category } from "@/features/categories/types";

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string(), projectId: z.string().nullish(), assigneeId: z.string().nullish(), status: z.nativeEnum(TaskStatus).nullish(), categoryId: z.string().nullish(), search: z.string().nullish(), dueDate: z.string().nullish(), hideAssigneeFilter: z.string().nullish() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get('databases');
      const user = c.get('user');

      const { workspaceId, projectId, assigneeId, status, search, dueDate, hideAssigneeFilter, categoryId } = c.req.valid('query');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      const query = [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ]

      if (projectId) {
        query.push(Query.equal('projectId', projectId));
      }

      if (status) {
        query.push(Query.equal('status', status));
      }

      if (categoryId) {
        query.push(Query.equal('categoryId', categoryId));
      }

      if (hideAssigneeFilter === 'true') {
        query.push(Query.equal('assigneeId', member.$id));
      }

      if (assigneeId) {
        query.push(Query.equal('assigneeId', assigneeId));
      }

      if (dueDate) {
        query.push(Query.greaterThanEqual('dueDate', dueDate));
        query.push(Query.lessThanEqual('dueDate', dueDate));
      }

      if (search) {
        query.push(Query.search('name', search));
      }

      const searchTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);

      const tasks = {
        documents: searchTasks.documents.filter((task) => task.parentTaskId === null),
        total: searchTasks.documents.filter((task) => task.parentTaskId === null).length
      }

      const projectIds = tasks.documents.map((task) => task.projectId).filter(Boolean);
      const assignneIds = tasks.documents.map((task) => task.assigneeId).filter(Boolean);
      const categoriesIds = tasks.documents.map((task) => task.categoryId).filter(Boolean);

      const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [Query.isNull('$id')]);

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, assignneIds.length > 0 ? [Query.contains('$id', assignneIds)] : [Query.isNull('$id')]);

      const categories = await databases.listDocuments<Category>(DATABASE_ID, CATEGORIES_ID, categoriesIds.length > 0 ? [Query.contains('$id', categoriesIds)] : [Query.isNull('$id')]);

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return { ...member, name: user.name || user.email, email: user.email };
        })
      )

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find((project) => project.$id === task.projectId);
        const assignee = assignees.find((member) => member.$id === task.assigneeId);
        const subtasks = {
          total: searchTasks.documents.filter((subtask) => subtask.parentTaskId === task.$id).length,
          documents: searchTasks.documents.filter((subtask) => subtask.parentTaskId === task.$id),
        }
        const category = categories.documents.find((category) => category.$id === task.categoryId);

        return {
          ...task,
          project,
          assignee,
          category,
          subtasks
        };
      });

      return c.json({ data: { ...tasks, documents: populatedTasks } });
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createTaskSchema),
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');

      const {
        name,
        status,
        categoryId,
        workspaceId,
        projectId,
        dueDate,
        assigneeId,
        parentTaskId
      } = c.req.valid('json');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('status', status),
          Query.equal('workspaceId', workspaceId),
          Query.orderAsc('position'),
          Query.limit(1),
          Query.isNull('parentTaskId'),
        ]
      );

      const newPosition = highestPositionTask.documents.length > 0 ? highestPositionTask.documents[0].position + 1000 : 1000;
      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          categoryId,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          parentTaskId,
          position: newPosition,
          completionPercentage: status === TaskStatus.DONE ? 100 : 0,
        }
      );

      if (parentTaskId) {
        const subtasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
          Query.equal("parentTaskId", parentTaskId),
        ]);

        const parentTask = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, parentTaskId);

        if (subtasks.total === 0) return c.json({ data: task, projectId, workspaceId, parentTaskId });

        const completedSubtasks = subtasks.documents.filter(task => task.status === TaskStatus.DONE).length + (parentTask.status === TaskStatus.DONE ? 1 : 0);

        const completionPercentage = Math.round((completedSubtasks / (subtasks.total + 1)) * 100);

        await databases.updateDocument(DATABASE_ID, TASKS_ID, parentTaskId, {
          completionPercentage,
          status: completionPercentage === 100 ? TaskStatus.DONE : TaskStatus.IN_PROGRESS,
        });
      }

      return c.json({ data: task, projectId, workspaceId, parentTaskId });
    }
  )
  .patch(
    '/:taskId',
    sessionMiddleware,
    zValidator('json', createTaskSchema.partial()),
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');

      const { taskId } = c.req.param();

      const existingTask = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

      const {
        name,
        status,
        categoryId,
        description,
        projectId,
        dueDate,
        assigneeId,
        parentTaskId
      } = c.req.valid('json');

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      let completionPercentage = 0;

      if (parentTaskId) {
        if (status === TaskStatus.DONE) {
          completionPercentage = 100;
        }
      } else {
        const subtasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
          Query.equal("parentTaskId", taskId),
        ]);

        if (subtasks.total > 0) {
          const completedSubtasks = subtasks.documents.filter(task => task.status === TaskStatus.DONE).length + (status === TaskStatus.DONE ? 1 : 0);

          completionPercentage = Math.round((completedSubtasks / (subtasks.total + 1)) * 100);
        } else {
          if (status === TaskStatus.DONE) {
            completionPercentage = 100;
          }
        }
      }

      const task = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          categoryId,
          projectId,
          dueDate,
          assigneeId,
          description,
          parentTaskId,
          completionPercentage,
        }
      );

      if (parentTaskId) {
        const subtasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
          Query.equal("parentTaskId", parentTaskId),
        ]);

        const parentTask = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, parentTaskId);

        if (subtasks.total === 0) return c.json({ data: task, projectId, workspaceId: existingTask.workspaceId, parentTaskId });

        const completedSubtasks = subtasks.documents.filter(task => task.status === TaskStatus.DONE).length + (parentTask.status === TaskStatus.DONE ? 1 : 0);

        const completionPercentage = Math.round((completedSubtasks / (subtasks.total + 1)) * 100);

        await databases.updateDocument(DATABASE_ID, TASKS_ID, parentTaskId, {
          completionPercentage,
          status: completionPercentage === 100 ? TaskStatus.DONE : TaskStatus.IN_PROGRESS,
        });
      }


      return c.json({ data: task, projectId, workspaceId: existingTask.workspaceId, parentTaskId });
    }
  )
  .delete(
    '/:taskId',
    sessionMiddleware,
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');

      const { taskId } = c.req.param();

      const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

      if (!task) {
        return c.json({ error: 'Task not found' }, 404);
      }

      const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

      if (task.parentTaskId) {
        const subtasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
          Query.equal("parentTaskId", task.parentTaskId),
        ]);

        const parentTask = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, task.parentTaskId);

        if (subtasks.total === 0) return c.json({ data: task, projectId: task.projectId, workspaceId: task.workspaceId, parentTaskId: task.parentTaskId });

        const completedSubtasks = subtasks.documents.filter(task => task.status === TaskStatus.DONE).length + (parentTask.status === TaskStatus.DONE ? 1 : 0);

        const completionPercentage = Math.round((completedSubtasks / (subtasks.total + 1)) * 100);

        await databases.updateDocument(DATABASE_ID, TASKS_ID, task.parentTaskId, {
          completionPercentage,
          status: completionPercentage === 100 ? TaskStatus.DONE : TaskStatus.IN_PROGRESS,
        });
      } else {
        const subtasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
          Query.equal("parentTaskId", taskId),
        ]);

        if (subtasks.total > 0) {
          await Promise.all(
            subtasks.documents.map(async (subtask) => {
              await databases.deleteDocument(DATABASE_ID, TASKS_ID, subtask.$id);
            })
          )
        }
      }


      return c.json({ data: { taskId, projectId: task.projectId, workspaceId: task.workspaceId, parentTaskId: task.parentTaskId } });
    }
  )
  .get(
    '/:taskId',
    sessionMiddleware,
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get('databases');
      const currentUser = c.get('user');

      const { taskId } = c.req.param();

      const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

      const currentMember = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: currentUser.$id,
      })

      if (!currentMember) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      const subtasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal("parentTaskId", taskId)
      ]);

      const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, task.projectId);

      const member = await databases.getDocument(DATABASE_ID, MEMBERS_ID, task.assigneeId);

      const category = await databases.getDocument(DATABASE_ID, CATEGORIES_ID, task.categoryId || '');

      const user = await users.get(member.userId);

      const assignee = {
        ...member,
        name: user.name || user.email,
        email: user.email,
      }

      return c.json({
        data: {
          ...task,
          project,
          subtasks,
          assignee,
          category
        }
      });
    }
  )
  .post(
    '/bulk-update',
    sessionMiddleware,
    zValidator('json', z.object({
      tasks: z.array(z.object({
        $id: z.string(),
        status: z.nativeEnum(TaskStatus),
        position: z.number().int().positive().min(1000).max(1_000_000),
        parentTaskId: z.string().nullish(),
      }))
    })),
    async (c) => {
      const databases = c.get('databases');
      const user = c.get('user');
      const { tasks } = c.req.valid('json');

      const tasksToUpdate = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [Query.contains('$id', tasks.map((task) => task.$id))]);

      const workspaceIds = new Set(tasksToUpdate.documents.map((task) => task.workspaceId));

      if (workspaceIds.size !== 1) {
        return c.json({ error: 'Tasks must belong to the same workspace' }, 400);
      }

      const workspaceId = workspaceIds.values().next().value;

      if (!workspaceId) {
        return c.json({ error: 'Workspace not found' }, 404);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, status, position, parentTaskId } = task;

          if (parentTaskId) {
            const subtasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
              Query.equal("parentTaskId", parentTaskId),
            ]);
    
            if (subtasks.total === 0) return c.json({ data: task });
    
            const completedSubtasks = subtasks.documents.filter(task => task.status === TaskStatus.DONE).length + (status === TaskStatus.DONE ? 1 : 0);
    
            const completionPercentage = Math.round((completedSubtasks / (subtasks.total + 1)) * 100);

            await databases.updateDocument(DATABASE_ID, TASKS_ID, parentTaskId, {
              completionPercentage,
              status: completionPercentage === 100 ? TaskStatus.DONE : TaskStatus.IN_PROGRESS,
            });
          }

          return databases.updateDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            $id,
            {
              status,
              position,
            }
          );
        })
      )

      return c.json({ data: updatedTasks });
    }
  )

export default app;