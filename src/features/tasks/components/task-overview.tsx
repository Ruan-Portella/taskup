import React from 'react'
import { Task } from '../types'
import { Button } from '@/components/ui/button'
import { PencilIcon } from 'lucide-react'
import { DottedSeparator } from '@/components/dotted-separator'
import OverviewProperty from './overview-property'
import { MemberAvatar } from '@/features/members/components/member-avatar'
import TaskDate from './task-date'
import { Badge } from '@/components/ui/badge'
import { statusToPTBR } from '@/lib/utils'
import { useEditTaskModal } from '../hooks/use-edit-task-modal'
import { Progress } from '@/components/ui/progress'
import { CategoryColumn } from './category-column'

interface TaskOverviewProps {
  task: Task
};

export default function TaskOverview({
  task
}: TaskOverviewProps) {
  const { open } = useEditTaskModal()
  const completionPercentage = task.completionPercentage;

  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
      <div className='bg-muted rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <p className='text-lg font-semibold'>Visão Geral</p>
          <Button onClick={() => open(task.$id)} size='sm' variant='secondary'>
            <PencilIcon className='size-4' />
            Editar
          </Button>
        </div>
        <DottedSeparator className='my-4' />
        <div className='flex flex-col gap-y-4'>
          <OverviewProperty label='Responsável'>
            <MemberAvatar
              name={task.assignee.name}
              className='size-6'
            />
            <p className='text-sm font-medium'>{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label='Data de Entrega'>
            <TaskDate value={task.dueDate} className='text-sm font-medium' />
          </OverviewProperty>
          <OverviewProperty label='Status'>
            <Badge variant={task.status}>
              {statusToPTBR(task.status)}
            </Badge>
          </OverviewProperty>
          <OverviewProperty label='Status'>
            <CategoryColumn category={task.category} />
          </OverviewProperty>
          <OverviewProperty label='Progresso'>
            <div className='flex items-center gap-x-2'>
              <span>{completionPercentage}%</span>
              <Progress className='w-[100px]' value={completionPercentage} />
            </div>
          </OverviewProperty>
        </div>
      </div>
    </div>
  )
}