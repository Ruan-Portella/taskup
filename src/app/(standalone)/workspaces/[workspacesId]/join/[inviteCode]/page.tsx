'use client';

import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';
import React from 'react'


export default function InviteCodePage() {
  const workspaceId = useWorkspacesId();

  const { data, isLoading } = useGetWorkspaceInfo({
    workspaceId: workspaceId,
    inviteCode: true
  })

  if (isLoading) {
    return <PageLoader />
  }

  if (!data) {
    return <PageError message="Área de Trabalho não encontrada" />
  }


  return (
    <div className='w-full lg:max-w-xl'>
      <JoinWorkspaceForm initialValues={data} />
    </div>
  )
}
