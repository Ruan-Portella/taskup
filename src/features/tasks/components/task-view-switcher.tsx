'use client';

import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader, PlusIcon } from 'lucide-react'
import React, { useCallback } from 'react'
import { useCreateTaskModal } from '../hooks/use-create-task-modal'
import { useGetTasks } from '../api/use-get-tasks'
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';
import { useQueryState } from 'nuqs';
import DataFilters from './data-filters';
import { useTaskFilters } from '../hooks/use-task-filters';
import { DataTable } from '../../../components/data-table';
import { columns } from './columns';
import DataKanban from './data-kanban';
import { TaskStatus } from '../types';
import { useBulkUpdateTasks } from '../api/use-bulk-update-tasks';
import DataCalendar from './data-calendar';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import { useMe } from '@/features/auth/api/use-me';

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
  hideAssigneeFilter?: boolean;
};

export default function TaskViewSwitcher({ hideProjectFilter, hideAssigneeFilter }: TaskViewSwitcherProps) {
  const [{
    status,
    assigneeId,
    projectId,
    dueDate,
    categoryId
  }] = useTaskFilters();

  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });

  const defaultProjectId = useProjectId();

  const me = useMe();

  const workspaceId = useWorkspacesId();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId, status, assigneeId: assigneeId, projectId: projectId || defaultProjectId, dueDate, hideAssigneeFilter, categoryId: categoryId });
  const { openProjectId, open, openSubTask } = useCreateTaskModal();

  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();

  const onKanbanChange = useCallback((tasks: { $id: string, status: TaskStatus, oldStatus: TaskStatus, position: number }[]) => {
    bulkUpdateTasks({
      json: { tasks }
    });
  }, [bulkUpdateTasks])
 
  return (
    <Tabs defaultValue={view} onValueChange={setView} className='flex-1 w-full border rounded-lg'>
      <div className='h-full flex flex-col overflow-auto p-4'>
        <div className='flex flex-col gap-y-2 lg:flex-row justify-between items-center'>
          <TabsList className='w-full lg:w-auto'>
            <TabsTrigger className='h-8 w-full lg:w-auto' value='table'>
              Tabela
            </TabsTrigger>
            <TabsTrigger className='h-8 w-full lg:w-auto' value='kanban'>
              Kanban
            </TabsTrigger>
            <TabsTrigger className='h-8 w-full lg:w-auto' value='calendar'>
              Calendário
            </TabsTrigger>
          </TabsList>
          <Button onClick={() => {
            if (hideProjectFilter) {
              openProjectId(projectId || defaultProjectId)
            } else if (hideAssigneeFilter) {
              openSubTask({task: {assigneeId: `${me?.data?.$id}-taskup`}})
            }  else {
              open()
            }
          }} size='sm' className='w-full lg:w-auto'><PlusIcon className='size-4' />Adicionar tarefa</Button>
        </div>
        <DottedSeparator className='my-4' />
        <DataFilters hideProjectFilter={hideProjectFilter} hideAssigneeFilter={hideAssigneeFilter} />
        <DottedSeparator className='my-4' />
        {
          isLoadingTasks ? (
            <div className='w-full border rounded-lg h-[200px] flex flex-col items-center justify-center'>
              <Loader className='size-5 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <>
              <TabsContent value='table' className='mt-0'>
                <DataTable columns={columns} data={tasks?.documents ?? []} />
              </TabsContent>
              <TabsContent value='kanban' className='mt-0'>
                <DataKanban onChange={onKanbanChange} data={tasks?.documents ?? []} />
              </TabsContent>
              <TabsContent value='calendar' className='mt-0 h-full pb-4'>
                <DataCalendar data={tasks?.documents ?? []} />
              </TabsContent>
            </>
          )
        }
      </div>
    </Tabs>
  )
}
