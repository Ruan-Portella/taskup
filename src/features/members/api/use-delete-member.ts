import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.members[':memberId']['$delete']>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({param}) => {
      const response = await client.api.members[':memberId']['$delete']({param});

      if (!response.ok) {
        throw new Error('Erro ao deletar membro');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('membro deletado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: () => {
      toast.error('Erro ao deletar membro');
    }
  })
  return mutation;
};