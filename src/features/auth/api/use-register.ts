import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.auth.register['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.register['$post']>['json'];

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.register.$post({json});

      if (!response.ok) {
        throw new Error('Erro ao efetuar cadastro');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Cadastro efetuado com sucesso!');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: () => {
      toast.error('Erro ao efetuar cadastro');
    }
  })
  return mutation;
};