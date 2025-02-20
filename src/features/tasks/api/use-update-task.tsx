import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.tasks[':taskId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[':taskId']['$patch']>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({json, param}) => {
      const response = await client.api.tasks[':taskId']['$patch']({json, param});

      if (!response.ok) {
        throw new Error('Erro ao atualizar a tarefa');
      }

      return await response.json();
    },
    onSuccess: ({data, projectId, workspaceId, parentTaskId}) => {
      toast.success('Tarefa atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (parentTaskId) {
        queryClient.invalidateQueries({ queryKey: ['task', parentTaskId] });
      }
      queryClient.invalidateQueries({ queryKey: ['task', data.$id] });
      queryClient.invalidateQueries({ queryKey: ['project-analytics', projectId] });
      queryClient.invalidateQueries({ queryKey: ['workspace-analytics', workspaceId] });
    },
    onError: () => {
      toast.error('Erro ao atualizar a tarefa');
    }
  })
  return mutation;
};