import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['$patch']>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({form, param}) => {
      const response = await client.api.workspaces[':workspaceId'].$patch({form, param});

      if (!response.ok) {
        throw new Error('Erro ao atualizar a área de trabalho');
      }

      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success('Área de trabalho atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: () => {
      toast.error('Erro ao atualizar a área de trabalho');
    }
  })
  return mutation;
};