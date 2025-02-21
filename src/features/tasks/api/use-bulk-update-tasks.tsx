import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';
import { useConfettiStore } from "@/hooks/use-confetti-store";

type ResponseType = InferResponseType<typeof client.api.tasks['bulk-update']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks['bulk-update']['$post']>;

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();
  const {onOpen} = useConfettiStore();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({json}) => {
      const response = await client.api.tasks['bulk-update']['$post']({json});

      if (!response.ok) {
        throw new Error('Erro ao atualizar as tarefas');
      }

      return await response.json();
    },
    onSuccess: ({hasTaskCompleted}) => {
      toast.success('Tarefas atualizadas com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-analytics'] });

      if (hasTaskCompleted) {
        onOpen();
      }
    },
    onError: () => {
      toast.error('Erro ao atualizar as tarefas');
    }
  })
  return mutation;
};