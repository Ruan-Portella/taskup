import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.categories[':categoryId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.categories[':categoryId']['$patch']>;

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({json, param}) => {
      const response = await client.api.categories[':categoryId']['$patch']({json, param});

      if (!response.ok) {
        throw new Error('Erro ao atualizar a categoria');
      }

      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success('Categoria atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', data.$id] });
      queryClient.invalidateQueries({queryKey: ['tasks']});
    },
    onError: () => {
      toast.error('Erro ao atualizar a categoria');
    }
  })
  return mutation;
};