import { useQuery } from "@tanstack/react-query";
import { client } from '@/lib/rpc';
import { TaskStatus } from "../types";

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  hideAssigneeFilter?: boolean;
  categoryId?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
  hideAssigneeFilter,
  categoryId
}: useGetTasksProps) => {
  const query = useQuery({
    queryKey: ['tasks', workspaceId, projectId, status, search, assigneeId, dueDate, hideAssigneeFilter, categoryId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({query: {
        workspaceId, 
        projectId: projectId ?? undefined,
        status: status ?? undefined,
        categoryId: categoryId ?? undefined,
        search: search ?? undefined,
        assigneeId: assigneeId ?? undefined,
        dueDate: dueDate ?? undefined,
        hideAssigneeFilter: hideAssigneeFilter?.toString() ?? 'false'
      }});

      if (!response.ok) {
        throw new Error('Erro ao buscar tarefas');
      }

      const { data } = await response.json();

      return data;
    }
  })
  return query;
};