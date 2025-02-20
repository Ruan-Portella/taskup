import React, { useState } from 'react'
import { Task } from '../types'
import { useUpdateTask } from '../api/use-update-task';
import { Button } from '@/components/ui/button';
import { PencilIcon, XIcon } from 'lucide-react';
import { DottedSeparator } from '@/components/dotted-separator';
import { Textarea } from '@/components/ui/textarea';

interface TaskDescriptionProps {
  task: Task;
};

export default function TaskDescription({ task }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate({
      json: { description: value },
      param: { taskId: task.$id }
    }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  return (
    <div className='p-4 border rounded-lg'>
      <div className='flex items-center justify-between'>
        <p className='text-lg font-semibold' >
          Descrição
        </p>
        <Button onClick={() => setIsEditing(!isEditing)} size='sm' variant='secondary'>
          {
            isEditing ? (
              <>
                <XIcon className='size-4' />
                Cancelar
              </>
            ) : (
              <>
                <PencilIcon className='size-4' />
                Editar
              </>
            )
          }
        </Button>
      </div>
      <DottedSeparator className='my-4' />
      {
        isEditing ? (
          <div className='flex flex-col gap-y-4'>
            <Textarea
              placeholder='Adicione uma descrição'
              value={value}
              rows={4}
              onChange={(e) => setValue(e.target.value)}
              disabled={isPending}
            />
            <Button onClick={handleSave} disabled={isPending} size='sm' className='w-fit ml-auto'>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        ) : (
          <div>
            {
              task.description || (
                <p className='text-muted-foreground'>
                  Nenhuma descrição.
                </p>
              )

            }
          </div>
        )
      }
    </div>
  )
}
