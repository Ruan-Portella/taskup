import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.tasks[':taskId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[':taskId']['$delete']>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({param}) => {
      const response = await client.api.tasks[':taskId']['$delete']({param});

      if (!response.ok) {
        throw new Error('Erro ao deletar tarefa');
      }

      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success('Tarefa deletada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.taskId] });
      queryClient.invalidateQueries({ queryKey: ['project-analytics', data.projectId] });
      queryClient.invalidateQueries({ queryKey: ['workspace-analytics', data.workspaceId] });
    },
    onError: () => {
      toast.error('Erro ao deletar tarefa');
    }
  })
  return mutation;
};