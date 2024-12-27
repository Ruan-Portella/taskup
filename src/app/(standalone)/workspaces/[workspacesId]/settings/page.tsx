import { getWorkspace } from '@/features/workspaces/api/get-workspace';
import { EditWorkspacesForm } from '@/features/workspaces/components/edit-workspaces-form';
import { redirect } from 'next/navigation';
import React from 'react'

interface WorkspaceSettingsPageProps {
  params: {
    workspacesId: string
  };
}

export default async function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
  const {workspacesId} = await params;
  const initialValues = await getWorkspace({ workspaceId: workspacesId });
  
  if (!initialValues) {
    redirect(`/workspaces/${workspacesId}`);
  }

  return (
    <div className='w-full lg:max-w-xl'>
      <EditWorkspacesForm initialValues={initialValues} />
    </div>
  )
}
