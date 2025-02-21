import React, { useCallback, useEffect } from 'react'
import { Task, TaskStatus } from '../types'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import KanbanColumnHeader from './kanban-column-header';
import KanbanCard from './kanban-card';

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE
]

type TasksState = {
  [key in TaskStatus]: Task[]
}

interface DataKanbanProps {
  data: Task[];
  onChange: (tasks: {$id: string, status: TaskStatus, oldStatus: TaskStatus, position: number}[]) => void;
};;

export default function DataKanban({ data, onChange }: DataKanbanProps) {
  const [tasks, setTasks] = React.useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: []
    };

    data.forEach(task => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach(status => {
      initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  useEffect(() => {
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: []
    };

    data.forEach(task => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach(status => {
      newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data])

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    let updatesPayload: {$id: string, status: TaskStatus, oldStatus: TaskStatus, position: number, parentTaskId?: string}[] = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      // Remover as tarefas da coluna de origem
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      // Se a tarefa não for encontrada, retorna o estado atual
      if (!movedTask) {
        console.error('Task not found');
        return prevTasks;
      }

      // Cria uma nova tarefa com a coluna de destino
      const updatedMovedTask = sourceStatus !== destinationStatus ? {...movedTask, status: destinationStatus} : movedTask;

      // Atualiza a coluna de origem
      newTasks[sourceStatus] = sourceColumn;


      // Adiciona a tarefa na coluna de destino
      const destinationColumn = [...newTasks[destinationStatus]];
      destinationColumn.splice(destination.index, 0, updatedMovedTask);
      newTasks[destinationStatus] = destinationColumn;

      // Prepara o payload de atualização
      updatesPayload = [];

      // Atualiza a posição da tarefa movida
      updatesPayload.push({
        $id: updatedMovedTask.$id,
        status: destinationStatus,
        oldStatus: sourceStatus,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
        parentTaskId: updatedMovedTask.subtasks && updatedMovedTask.subtasks?.total > 0 ? updatedMovedTask.$id : undefined
      });

      // Atualiza a posição das tarefas restantes na coluna de destino
      newTasks[destinationStatus].forEach((task, index) => {
        if (task && task.$id !== updatedMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatesPayload.push({
              $id: task.$id,
              status: destinationStatus,
              oldStatus: sourceStatus,
              position: newPosition,
              parentTaskId: task.subtasks && task.subtasks?.total > 0 ? task.$id : undefined
            });
          }
        }
      });

      // Se a coluna de origem for diferente da coluna de destino, atualiza a posição das tarefas restantes na coluna de origem
      if (sourceStatus !== destinationStatus) {
        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: destinationStatus,
                oldStatus: sourceStatus,
                position: newPosition,
                parentTaskId: task.subtasks && task.subtasks?.total > 0 ? task.$id : undefined
              });
            }
          }
        });
      }

      return newTasks;
    });

    onChange(updatesPayload)
  }, [onChange]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='flex overflow-x-auto'>
        {
          boards.map((board) => {
            return (
              <div key={board} className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]'>
                <KanbanColumnHeader
                  board={board}
                  taskCount={tasks[board].length}
                />
                <Droppable droppableId={board}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className='min-h-[200px] py-1.5'>
                      {tasks[board].map((task, index) => (
                        <Draggable key={task.$id} draggableId={task.$id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <KanbanCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })
        }
      </div>
    </DragDropContext>
  )
}
