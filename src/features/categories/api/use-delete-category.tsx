import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.categories[':categoryId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.categories[':categoryId']['$delete']>;

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({param}) => {
      const response = await client.api.categories[':categoryId']['$delete']({param});

      if (!response.ok) {
        throw new Error('Erro ao deletar categoria');
      }

      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success('Categoria deletada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoy', data.categoryId] });
    },
    onError: () => {
      toast.error('Erro ao deletar categoria');
    }
  })
  return mutation;
};