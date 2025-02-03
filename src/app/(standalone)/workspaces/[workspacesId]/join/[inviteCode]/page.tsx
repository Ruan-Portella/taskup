import { getWorkspaceInfo } from '@/features/workspaces/api/get-workspace';
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { redirect } from 'next/navigation';
import React from 'react'

interface InviteCodePageProps {
  params: {
    workspacesId: string
  };
}

export default async function InviteCodePage({
  params,
}: InviteCodePageProps) {
  const { workspacesId } = await params;

  const initialValues = await getWorkspaceInfo({
    workspaceId: workspacesId,
  })

  if (!initialValues) {
    redirect('/');
  };

  return (
    <div className='w-full lg:max-w-xl'>
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  )
}
