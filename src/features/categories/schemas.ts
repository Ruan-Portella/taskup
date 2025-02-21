import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string({ required_error: 'Campo obrigatório' }).trim().min(1, 'Campo obrigatório'),
  workspaceId: z.string().trim().min(1, 'Campo obrigatório'),
})

export const editCategorySchema = z.object({
  $id: z.string(),
  name: z.string({ required_error: 'Campo obrigatório' }).trim().min(1, 'Campo obrigatório'),
  workspaceId: z.string().trim().min(1, 'Campo obrigatório'),
})
