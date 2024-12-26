import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces['$post']>;
type RequestType = InferRequestType<typeof client.api.workspaces['$post']>['json'];

export const useCreate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.workspaces.$post({json});

      if (!response.ok) {
        throw new Error('Erro ao criar a área de trabalho');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Area de trabalho criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: 'workspaces' });
    },
    onError: () => {
      toast.error('Erro ao criar a área de trabalho');
    }
  })
  return mutation;
};