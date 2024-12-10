import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import {client} from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>;

export const useLogout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['me']});
    }
  })
  return mutation;
};