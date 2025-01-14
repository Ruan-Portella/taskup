import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['$delete'], 201>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['$delete']>;

export const useDeleteWorkspaces = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({param}) => {
      const response = await client.api.workspaces[':workspaceId']['$delete']({param});

      if (!response.ok) {
        throw new Error('Erro ao deletar área de trabalho');
      }

      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success('Área de trabalho deletada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: () => {
      toast.error('Erro ao deletar área de trabalho');
    }
  })
  return mutation;
};