import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['join']['$post'], 201>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['join']['$post']>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({param, json}) => {
      const response = await client.api.workspaces[':workspaceId']['join']['$post']({param, json});

      if (!response.ok) {
        throw new Error('Erro ao entrar no workspace');
      }

      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success('Entrou no workspace com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: () => {
      toast.error('Erro ao entrar no workspace');
    }
  })
  return mutation;
};