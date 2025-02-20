import React from 'react'
import { Task, TaskStatus } from '../types'
import { Button } from '@/components/ui/button';
import { DottedSeparator } from '@/components/dotted-separator';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, MoreVerticalIcon, PlusIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useUpdateTask } from '../api/use-update-task';
import { TaskActions } from './task-actions';

interface TaskSubTasksProps {
  task: Task;
};

interface TaskListProps {
  data: Task[];
};

const statusIconMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: 'bg-pink-500',
  [TaskStatus.TODO]: 'bg-red-500',
  [TaskStatus.IN_PROGRESS]: 'bg-yellow-500',
  [TaskStatus.IN_REVIEW]: 'bg-blue-500',
  [TaskStatus.DONE]: 'bg-emerald-500',
};

export default function TaskSubTasks({ task }: TaskSubTasksProps) {
  const { openSubTask } = useCreateTaskModal()

  return (
    <div className='p-4 border rounded-lg'>
      <div className='flex items-center justify-between'>
        <p className='text-lg font-semibold' >
          Sub Tarefas ({task.subtasks?.total || 0})
        </p>
        <Button onClick={() => openSubTask({ projectTaskId: task.projectId, task: { id: task.$id, assigneeId: task.assigneeId } })} size='sm' className='w-full lg:w-auto'><PlusIcon className='size-4' />Adicionar tarefa</Button>
      </div>
      <DottedSeparator className='my-4' />
      <TaskList data={task.subtasks?.documents || []} />
    </div>
  )
}

const TaskList = ({ data }: TaskListProps) => {
  const { mutate, isPending } = useUpdateTask();

  const onSubmit = ({ status, id, parentTaskId }: { status: TaskStatus, parentTaskId: string, id: string }) => {
    mutate({ json: { status, parentTaskId: parentTaskId }, param: { taskId: id } });
  };

  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
      <ul className='flex flex-col gap-y-4'>
        {
          data.map((task) => (
            <li key={task.$id}>
              <Card className='shadow-none rounded-lg hover:opacity-75 transition'>
                <CardContent className='p-4'>
                  <p className='text-lg font-medium truncate'>{task.name}</p>
                  <div className='flex items-center gap-x-2'>
                    <p>{task?.project?.name}</p>
                    <div className='size-1 rounded-full bg-neutral-300' />
                    <div className='text-sm text-muted-foreground flex items-center'>
                      <CalendarIcon className='size-3 mr-1' />
                      <span className='truncate'>
                        {formatDistanceToNow(new Date(task.dueDate), {
                          locale: ptBR
                        })}
                      </span>
                    </div>
                    <Select disabled={isPending} value={task.status} defaultValue={task.status} onValueChange={(e) => onSubmit({ status: e as TaskStatus, parentTaskId: task.parentTaskId as string, id: task.$id })}>
                      <SelectTrigger className={cn('ml-auto w-fit gap-2 rounded-xl h-[25px]', statusIconMap[task.status])}>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>
                          Pendente
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>
                          A Fazer
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          Em Progresso
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          Em Revisão
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>
                          Concluído
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <TaskActions id={task.$id} projectId={task.projectId} isSubTask parentTaskId={task.parentTaskId} assigneeId={task.assigneeId}>
                      <MoreVerticalIcon className='size-4 cursor-pointer' />
                    </TaskActions>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))
        }
        <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
          Sem tarefas
        </li>
      </ul>
    </div>
  )
}