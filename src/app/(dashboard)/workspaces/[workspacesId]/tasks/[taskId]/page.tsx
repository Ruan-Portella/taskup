'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetTask } from '@/features/tasks/api/use-get-task';
import TaskBreadCrumbs from '@/features/tasks/components/task-bread-crumbs';
import TaskDescription from '@/features/tasks/components/task-description';
import TaskOverview from '@/features/tasks/components/task-overview';
import TaskSubTasks from '@/features/tasks/components/task-sub-tasks';
import { useTaskId } from '@/features/tasks/hooks/use-task-id'
import React from 'react'

export default function TaskIdPage() {
  const taskId = useTaskId();

  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />
  }

  if (!data) {
    return PageError({ message: 'Tarefa não encontrada' });
  }

  return (
    <div className='flex flex-col'>
      <TaskBreadCrumbs project={data.project} task={{...data, subtasks: undefined}} />
      <DottedSeparator className='my-6' />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <TaskOverview task={{...data, subtasks: undefined}} />
        <TaskDescription task={{...data, subtasks: undefined}} />
        <TaskSubTasks task={data} />
      </div>
    </div>
  )
}
