import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';
import { ListChecksIcon, UserIcon } from 'lucide-react';
import React from 'react'
import { TaskStatus } from '../types';
import { useTaskFilters } from '../hooks/use-task-filters';
import DatePicker from '@/components/date-picker';

interface DataFiltersProps {
  hideProjectFilter?: boolean;
};

export default function DataFilters({ hideProjectFilter }: DataFiltersProps) {
  const workspaceId = useWorkspacesId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map(project => ({
    value: project.$id,
    label: project.name,
  }));

  const memberOptions = members?.documents.map(member => ({
    value: member.$id,
    label: member.name,
  }));

  const [{
    status,
    assigneeId,
    projectId,
    dueDate
  }, setFilters] = useTaskFilters();

  const onStatusChange = (status: string) => {
    setFilters({ status: status === 'all' ? null : status as TaskStatus });
  };

  const onAssigneeChange = (assigneeId: string) => {
    setFilters({ assigneeId: assigneeId === 'all' ? null : assigneeId });
  };

  const onProjectChange = (projectId: string) => {
    setFilters({ projectId: projectId === 'all' ? null : projectId });
  };

  if (isLoading) return null;

  return (
    <div className='flex flex-col lg:flex-row gap-2'>
      <Select defaultValue={projectId ?? undefined} onValueChange={(value) => onProjectChange(value)}>
        <SelectTrigger className='w-full lg:w-auto h-8'>
          <div className='flex items-center gap-2'>
            <UserIcon className='size-4' />
            <SelectValue placeholder='Todos Projetos' />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Todos Projetos</SelectItem>
          <SelectSeparator />
          {projectOptions?.map(project => (
            <SelectItem key={project.value} value={project.value}>
              {project.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={assigneeId ?? undefined} onValueChange={(value) => onAssigneeChange(value)}>
        <SelectTrigger className='w-full lg:w-auto h-8'>
          <div className='flex items-center gap-2'>
            <UserIcon className='size-4' />
            <SelectValue placeholder='Todos Responsáveis' />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Todos Responsáveis</SelectItem>
          <SelectSeparator />
          {memberOptions?.map(member => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker className='h-8 lg:w-fit' placeholder='Data de Entrega' value={dueDate ? new Date(dueDate) : undefined} onChange={(value) => setFilters({ dueDate: value ? value.toISOString() : null})} />
      <Select defaultValue={status ?? undefined} onValueChange={(value) => onStatusChange(value)}>
        <SelectTrigger className='w-full lg:w-auto h-8'>
          <div className='flex items-center gap-2'>
            <ListChecksIcon className='size-4' />
            <SelectValue placeholder='Todos Status' />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Todos Status</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>
            Pendente
          </SelectItem>
          <SelectItem value={TaskStatus.TODO}>
            A Fazer
          </SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>
            Em Progresso
          </SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>
            Em Revisão
          </SelectItem>
          <SelectItem value={TaskStatus.DONE}>
            Concluído
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
};
