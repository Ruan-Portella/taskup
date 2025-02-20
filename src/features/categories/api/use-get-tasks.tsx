import { useQuery } from "@tanstack/react-query";
import { client } from '@/lib/rpc';

interface useGetCategoriesProps {
  workspaceId: string;
}

export const useGetCategories = ({
  workspaceId,
}: useGetCategoriesProps) => {
  const query = useQuery({
    queryKey: ['categories', workspaceId],
    queryFn: async () => {
      const response = await client.api.categories.$get({query: {
        workspaceId, 
      }});

      if (!response.ok) {
        throw new Error('Erro ao buscar categorias');
      }

      const { data } = await response.json();

      return data;
    }
  })
  return query;
};