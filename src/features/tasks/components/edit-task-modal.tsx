'use client';

import { ResponsiveModal } from '@/components/responsive-modal'
import React from 'react'
import { useEditTaskModal } from '../hooks/use-edit-task-modal';
import EditTaskFormWrapper from './edit-task-form-wrapper';

export default function EditTaskModal() {
  const { taskId, close, task, projectId: projectIdModal } = useEditTaskModal()

  const projectId = projectIdModal ? projectIdModal : undefined
  const assigneeId = task?.assigneeId ? task?.assigneeId : undefined
  const parentTaskId = task?.parentTaskId ? task?.parentTaskId : undefined

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {
        taskId && (
          <EditTaskFormWrapper onCancel={close} id={taskId} projectId={projectId} assigneeId={assigneeId} parentTaskId={parentTaskId} />
        )
      }
    </ResponsiveModal>
  )
}
