import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['$delete'], 201>;
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['$delete']>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({param}) => {
      const response = await client.api.projects[':projectId']['$delete']({param});

      if (!response.ok) {
        throw new Error('Erro ao deletar projeto');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Projeto deletado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Erro ao deletar projeto');
    }
  })
  return mutation;
};