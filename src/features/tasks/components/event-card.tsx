import { Project } from '@/features/projects/types/project';
import React from 'react'
import { TaskStatus } from '../types';
import { cn } from '@/lib/utils';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangleIcon, LaptopMinimalCheckIcon } from 'lucide-react';

interface EventCardProps {
  title: string;
  assignee: { name: string };
  project: Project;
  status: TaskStatus;
  id: string;
  subtasks?: {
    total: number;
  },
  completionPercentage?: number;
};

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: 'border-l-pink-500',
  [TaskStatus.TODO]: 'border-l-red-500',
  [TaskStatus.IN_PROGRESS]: 'border-l-yellow-500',
  [TaskStatus.IN_REVIEW]: 'border-l-blue-500',
  [TaskStatus.DONE]: 'border-l-emerald-500',
};

export default function EventCard({ title, assignee, project, status, id, completionPercentage, subtasks }: EventCardProps) {
  const workspaceId = useWorkspacesId();
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className='px-2'>
      <div onClick={onClick} className={cn('p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition', statusColorMap[status])}>
        <p className='truncate'>{title}</p>
        <div className='flex items-center gap-x-1 overflow-hidden'>
          <MemberAvatar
            className='size-6'
            name={assignee?.name}
          />
          <div className='size-1 rounded-full bg-neutral-300' />
          <ProjectAvatar
            name={project?.name}
            image={project?.imageUrl}
          />
          <div className='size-1 rounded-full bg-neutral-300' />
          <div className='mt-0.5'>
            <p>
              {completionPercentage}% concluído
            </p>
          </div>
          {
            subtasks && subtasks?.total > 0 && (
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
      </div>
    </div>
  )
}
