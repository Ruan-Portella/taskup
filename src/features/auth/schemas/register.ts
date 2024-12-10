import z from 'zod';

export const SignUpSchema = z.object({
  name: z.string().trim().min(3, {
    message: 'Nome Inválido',
  }),
  email: z.string().email({
    message: 'Por favor, coloque um email válido',
  }),
  password: z.string().min(8, {
    message: 'Senha deve ter no mínimo 8 caracteres',
  })
});

export type SignUpInfer = z.infer<typeof SignUpSchema>;