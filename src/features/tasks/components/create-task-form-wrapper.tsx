import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';
import { Loader } from 'lucide-react';
import React from 'react'
import { CreateTaskForm } from './create-task-form';
import { TaskStatus } from '../types';

interface CreateTaskFormWrapperProps {
  onCancel: () => void
  status: TaskStatus | undefined
  taskId: string | undefined
  projectId: string | undefined
  assigneeId: string | undefined
};

export default function CreateTaskFormWrapper({ onCancel, status, taskId, projectId, assigneeId }: CreateTaskFormWrapperProps) {
  const workspaceId = useWorkspacesId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const projectOptions = projects?.documents.map(project => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl
  }));

  const memberOptions = members?.documents.map(member => ({
    id: member.$id,
    name: member.name,
    userId: member.userId
  }));

  if (assigneeId?.includes('-taskup')) {
    assigneeId = memberOptions?.find(member => member.userId === assigneeId?.replace('-taskup', ''))?.id;
  }

  const isLoading = isLoadingMembers || isLoadingProjects;

  if (isLoading) {
    return (
      <Card className='w-full h-[714px] border-none shadow-none'>
        <CardContent className='flex items-center justify-center h-full'>
          <Loader className='fize-5 animate-spin text-muted-foreground' />
        </CardContent>
      </Card>
    )
  };

  return (
    <CreateTaskForm onCancel={onCancel} projectOptions={projectOptions ?? []} memberOptions={memberOptions ?? []} status={status} taskId={taskId} projectId={projectId} assigneeId={assigneeId} />
  );
};
