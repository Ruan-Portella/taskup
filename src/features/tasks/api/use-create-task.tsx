import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.tasks['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks['$post']>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({json}) => {
      const response = await client.api.tasks.$post({json});

      if (!response.ok) {
        throw new Error('Erro ao criar a tarefa');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Tarefa criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast.error('Erro ao criar a tarefa');
    }
  })
  return mutation;
};