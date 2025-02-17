'use client';

import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import React from 'react'

export default function ProjectIdSettingsPage() {
  const projectId = useProjectId();
  const {data, isLoading} = useGetProject({
    projectId: projectId
  })

  if (isLoading) {
    return <PageLoader />
  }

  if (!data) {
    return <PageError message="Projeto não encontrado" />
  }

  return (
    <div className='w-full lg:max-w-xl'>
      <EditProjectForm initialValues={data} />
    </div>
  )
}
