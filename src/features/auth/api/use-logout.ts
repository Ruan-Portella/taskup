import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import {client} from '@/lib/rpc';
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();

      if (!response.ok) {
        throw new Error('Erro ao encerrar sessão');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Sessão encerrada com sucesso');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: 'me' });
    },
    onError: () => {
      toast.error('Erro ao encerrar sessão');
    }
  })
  return mutation;
};