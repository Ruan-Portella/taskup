import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.projects['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.projects['$post']>['form'];

export const useCreateProjects = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.projects.$post({form});

      if (!response.ok) {
        throw new Error('Erro ao criar a projeto');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Projeto criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Erro ao criar a projeto');
    }
  })
  return mutation;
};