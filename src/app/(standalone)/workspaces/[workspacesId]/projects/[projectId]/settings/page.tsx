import { EditProjectForm } from '@/features/projects/components/edit-project-form';
import { getProject } from '@/features/projects/queries'
import React from 'react'

export default async function ProjectIdSettingsPage({
  params
}: { params: { projectId: string } }) {
  const { projectId } = await params;

  const initialValues = await getProject({ projectId });

  return (
    <div className='w-full lg:max-w-xl'>
      <EditProjectForm initialValues={initialValues} />
    </div>
  )
}
