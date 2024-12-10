import z from 'zod';

export const SignInSchema = z.object({
  email: z.string().email({
    message: 'Por favor, coloque um email válido',
  }),
  password: z.string().min(3, {
    message: 'Senha Inválida',
  })
});

export type SignInInfer = z.infer<typeof SignInSchema>;