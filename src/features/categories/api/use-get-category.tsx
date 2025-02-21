import { useQuery } from "@tanstack/react-query";
import { client } from '@/lib/rpc';

interface useGetCategoryProps {
  categoryId: string
}

export const useGetCategory = ({
  categoryId
}: useGetCategoryProps) => {
  const query = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const response = await client.api.categories[':categoryId'].$get({
        param: {categoryId}
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar categoria');
      }

      const { data } = await response.json();

      return data;
    }
  })
  return query;
};