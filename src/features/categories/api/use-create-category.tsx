import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.categories['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.categories['$post']>;

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({json}) => {
      const response = await client.api.categories.$post({json});

      if (!response.ok) {
        throw new Error('Erro ao criar a categoria');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Categoria criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      toast.error('Erro ao criar a categoria');
    }
  })
  return mutation;
};