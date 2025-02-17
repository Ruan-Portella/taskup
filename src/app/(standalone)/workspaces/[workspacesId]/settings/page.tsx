'use client';

import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { EditWorkspacesForm } from '@/features/workspaces/components/edit-workspaces-form';
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';
import React from 'react'

export default function WorkspaceSettingsPage() {
  const workspacesId = useWorkspacesId();
  const {data, isLoading} = useGetWorkspace({workspaceId: workspacesId})

  if (isLoading) {
    return <PageLoader />
  }

  if (!data) {
    return <PageError message="Área de Trabalho não encontrada" />
  }
  return (
    <div className='w-full lg:max-w-xl'>
      <EditWorkspacesForm initialValues={data} />
    </div>
  )
}
