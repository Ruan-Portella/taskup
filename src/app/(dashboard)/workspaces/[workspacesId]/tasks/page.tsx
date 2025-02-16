import TaskViewSwitcher from '@/features/tasks/components/task-view-switcher'
import React from 'react'

export default function TasksPage() {
  return (
    <div className='h-full flex flex-col'>
      <TaskViewSwitcher />
    </div>
  )
}
