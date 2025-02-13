import {z} from 'zod';

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório').optional(),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === '' ? undefined : value),
  ]).optional()
});