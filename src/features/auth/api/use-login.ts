import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import {client} from '@/lib/rpc';
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.auth.login['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.login['$post']>['json'];

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.login.$post({json});

      if (!response.ok) {
        throw new Error('Erro ao efetuar login');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Login efetuado com sucesso!');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: 'me' });
    },
    onError: () => {
      toast.error('Erro ao efetuar login');
    }
  })
  return mutation;
};