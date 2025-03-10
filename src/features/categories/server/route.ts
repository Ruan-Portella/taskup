import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getMember } from "@/features/members/utils/get-member";
import { CATEGORIES_ID, DATABASE_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Category } from "../types";
import { createCategorySchema } from "../schemas";
import { Task } from "@/features/tasks/types";

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const databases = c.get('databases');
      const user = c.get('user');

      const { workspaceId } = c.req.valid('query');

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

      const searchCategories = await databases.listDocuments<Category>(DATABASE_ID, CATEGORIES_ID, query);

      return c.json({ data: { ...searchCategories } });
    }
  )
  .get(
    '/:categoryId',
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases');
      const user = c.get('user');

      const { categoryId } = c.req.param();

      const category = await databases.getDocument<Category>(DATABASE_ID, CATEGORIES_ID, categoryId);

      const member = await getMember({
        databases,
        workspaceId: category.workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      return c.json({ data: { ...category } });
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createCategorySchema),
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');

      const {
        name,
        workspaceId,
        color,
      } = c.req.valid('json');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      const category = await databases.createDocument(
        DATABASE_ID,
        CATEGORIES_ID,
        ID.unique(),
        {
          name,
          workspaceId,
          color
        }
      );

      return c.json({ data: category });
    }
  )
  .patch(
    '/:categoryId',
    sessionMiddleware,
    zValidator('json', createCategorySchema.partial()),
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');

      const { categoryId } = c.req.param();

      const existingCategory = await databases.getDocument<Category>(DATABASE_ID, CATEGORIES_ID, categoryId);

      const {
        name,
        color,
      } = c.req.valid('json');

      const member = await getMember({
        databases,
        workspaceId: existingCategory.workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      const category = await databases.updateDocument(
        DATABASE_ID,
        CATEGORIES_ID,
        categoryId,
        {
          name,
          color
        }
      );

      return c.json({ data: category });
    }
  )
  .delete(
    '/:categoryId',
    sessionMiddleware,
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');

      const { categoryId } = c.req.param();

      const categoy = await databases.getDocument<Category>(DATABASE_ID, CATEGORIES_ID, categoryId);

      if (!categoy) {
        return c.json({ error: 'Category not found' }, 404);
      }

      const member = await getMember({
        databases,
        workspaceId: categoy.workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'You are not a member of this workspace' }, 403);
      }

      await databases.deleteDocument(DATABASE_ID, CATEGORIES_ID, categoryId);

      const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
        Query.equal('categoryId', categoryId),
      ]);

      await Promise.all(
        tasks.documents.map(async (task) => {
          const { $id } = task;

          return databases.updateDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            $id,
            {
              categoryId: null,
            }
          );
        })
      )

      return c.json({ data: { categoryId } });
    }
  )

export default app;