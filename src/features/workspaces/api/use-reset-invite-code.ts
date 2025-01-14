import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['reset-invite-code']['$post'], 201>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['reset-invite-code']['$post']>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({param}) => {
      const response = await client.api.workspaces[':workspaceId']['reset-invite-code']['$post']({param});

      if (!response.ok) {
        throw new Error('Erro ao resetar código de convite');
      }

      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success('Código de convite resetado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: () => {
      toast.error('Erro ao resetar código de convite');
    }
  })
  return mutation;
};