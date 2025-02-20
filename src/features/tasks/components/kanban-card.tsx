import React from 'react'
import { Task } from '../types'
import { TaskActions } from './task-actions';
import { AlertTriangleIcon, LaptopMinimalCheckIcon, MoreHorizontal } from 'lucide-react';
import { DottedSeparator } from '@/components/dotted-separator';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import TaskDate from './task-date';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { CircularProgress } from '@/components/circular-progress';
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';

interface KanbanCardProps {
  task: Task;
};

export default function KanbanCard({
  task
}: KanbanCardProps) {
  return (
    <div className='bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3'>
      <div className='flex items-start justify-between gap-x-2'>
        <p className='text-sm line-clamp-2'>{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className='size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition hover:cursor-pointer' />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className='flex items-center gap-x-1.5'>
        <MemberAvatar
          name={task.assignee?.name}
          className='size-6'
          fallbackClassname='text-[10px]'
        />
        <div className='size-1 rounded-full bg-neutral-300' />
        <TaskDate value={task.dueDate} className='text-xs' />
      </div>
      <div className='flex items-center gap-x-1.5'>
        <ProjectAvatar
          name={task.project.name}
          image={task.project.imageUrl}
          fallBackClassname='text-[10px]'
        />
        <span className='text-xs font-medium'>
          {task.project.name}
        </span>
        <div className='size-1 rounded-full bg-neutral-300' />
        <div className='mt-0.5'>
          <CircularProgress percentage={task.completionPercentage || 0} />
        </div>
        {
          task.subtasks && task.subtasks?.total > 0 && (
            <>
              <div className='size-1 rounded-full bg-neutral-300' />
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger className='flex items-center'>
                    <LaptopMinimalCheckIcon className='size-5 mr-1 text-black' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs flex gap-1'>
                      <AlertTriangleIcon className='size-4' />
                      Esta tarefa possui subtarefas.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )
        }
      </div>
    </div >
  );
};
