'use client';
import Analytics from '@/components/analytics';
import { CircularProgress } from '@/components/circular-progress';
import { DottedSeparator } from '@/components/dotted-separator';
import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { Member } from '@/features/members/types/member';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { Project } from '@/features/projects/types/project';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { Task } from '@/features/tasks/types';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, LaptopMinimalCheckIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function WorkspaceIdPage() {
  const workspaceId = useWorkspacesId();

  const { data: analytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading = isLoadingAnalytics || isLoadingTasks || isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return <PageLoader />
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message='Erro ao carregar dados' />
  }

  return (
    <div className='h-full flex flex-col space-y-4'>
      <Analytics data={analytics} />
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MembersList data={members.documents} total={members.total} />
      </div>
    </div>
  )
}

interface TaskListProps {
  data: Task[];
  total: number;
};

interface ProjectListProps {
  data: Project[];
  total: number;
};

interface MemberListProps {
  data: Member[];
  total: number;
};

const TaskList = ({ data, total }: TaskListProps) => {
  const { open: createTask } = useCreateTaskModal();
  const workspaceId = useWorkspacesId();

  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
      <div className='bg-muted rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <p className='text-lg font-semibold'>
            Tarefas ({total})
          </p>
          <Button variant='muted' size='icon' onClick={() => createTask()}>
            <PlusIcon className='size-4 text-neutral-400' />
          </Button>
        </div>
        <DottedSeparator className='my-4' />
        <ul className='flex flex-col gap-y-4'>
          {
            data.map((task) => (
              <li key={task.$id}>
                <Link href={`/workspaces/${task.workspaceId}/tasks/${task.$id}`}>
                  <Card className='shadow-none rounded-lg hover:opacity-75 transition'>
                    <CardContent className='p-4'>
                      <p className='text-lg font-medium truncate'>{task.name}</p>
                      <div className='flex items-center gap-x-2'>
                        <p>{task?.project?.name}</p>
                        <div className='size-1 rounded-full bg-neutral-300' />
                        <div className='text-sm text-muted-foreground flex items-center'>
                          <CalendarIcon className='size-3 mr-1' />
                          <span className='truncate'>
                            {formatDistanceToNow(new Date(task.dueDate), {
                              locale: ptBR
                            })}
                          </span>
                        </div>
                        <div className='size-1 rounded-full bg-neutral-300' />
                        <div className='mt-0.5'>
                          <CircularProgress percentage={task.completionPercentage || 0} />
                        </div>
                        {
                          task.subtasks && task.subtasks.total > 0 && (
                            <>
                              <div className='size-1 rounded-full bg-neutral-300' />
                              <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                  <TooltipTrigger className='flex items-center'>
                                    <div className='text-xs flex gap-1'>
                                      <LaptopMinimalCheckIcon className='size-5 mr-1 text-black' />

                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Esta tarefa possui subtarefas.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )
                        }
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))
          }
          <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
            Sem tarefas
          </li>
        </ul>
        <Button variant='muted' className='mt-4 w-full' asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>
            Mostrar todas
          </Link>
        </Button>
      </div>
    </div>
  )
}

const ProjectList = ({ data, total }: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
      <div className='bg-white border rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <p className='text-lg font-semibold'>
            Projetos ({total})
          </p>
          <Button variant='secondary' size='icon' onClick={() => createProject()}>
            <PlusIcon className='size-4 text-neutral-400' />
          </Button>
        </div>
        <DottedSeparator className='my-4' />
        <ul className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {
            data.map((project) => (
              <li key={project.$id}>
                <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}`}>
                  <Card className='shadow-none rounded-lg hover:opacity-75 transition'>
                    <CardContent className='p-4 flex items-center gap-x-2.5'>
                      <ProjectAvatar
                        className='size-12'
                        fallBackClassname='text-lg'
                        name={project.name}
                        image={project.imageUrl}
                      />
                      <p className='text-lg font-medium truncate'>
                        {project.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))
          }
          <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
            Sem projeto
          </li>
        </ul>
      </div>
    </div>
  )
}

const MembersList = ({ data, total }: MemberListProps) => {
  const workspaceId = useWorkspacesId();

  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
      <div className='bg-white border rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <p className='text-lg font-semibold'>
            Membros ({total})
          </p>
          <Button variant='secondary' size='icon' asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className='size-4 text-neutral-400' />
            </Link>
          </Button>
        </div>
        <DottedSeparator className='my-4' />
        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {
            data.map((member) => (
              <li key={member.$id}>
                <Card className='shadow-none rounded-lg overflow-hidden'>
                  <CardContent className='p-3 flex flex-col items-center gap-x-2'>
                    <MemberAvatar
                      className='size-12'
                      name={member.name}
                    />
                    <div className='flex flex-col items-center overflow-hidden'>
                      <p className='text-lg font-medium line-clamp-1'>
                        {member.name}
                      </p>
                      <p className='text-sm text-muted-foreground line-clamp-1'>
                        {member.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))
          }
          <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
            Sem membros
          </li>
        </ul>
      </div>
    </div>
  )
}

