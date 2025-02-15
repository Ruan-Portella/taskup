'use client';

import { ResponsiveModal } from '@/components/responsive-modal'
import React from 'react'
import { useCreateTaskModal } from '../hooks/use-create-task-modal'
import CreateTaskFormWrapper from './create-task-form-wrapper';
import { TaskStatus } from '../types';

export default function CreateTaskModal() {
  const { isOpen, setIsOpen, status } = useCreateTaskModal()

  const statusTask = status ? status as TaskStatus : undefined

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} status={statusTask} />
    </ResponsiveModal>
  )
}
