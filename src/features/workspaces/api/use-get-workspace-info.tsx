import { useQuery } from "@tanstack/react-query";
import { client } from '@/lib/rpc';

interface useGetWorkspaceInfoProps {
  workspaceId: string;
  inviteCode?: boolean;
}

export const useGetWorkspaceInfo= ({
  workspaceId,
  inviteCode = false
}: useGetWorkspaceInfoProps) => {
  const query = useQuery({
    queryKey: ['workspace-info', workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId'].$get({param: {workspaceId}, query: {inviteCode: inviteCode ? String(inviteCode) : undefined}});

      if (!response.ok) {
        throw new Error('Erro ao buscar a área de trabalho');
      }

      const { data } = await response.json();

      return data;
    }
  })
  return query;
};