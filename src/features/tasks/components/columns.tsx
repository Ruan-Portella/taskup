'use client';
import { ColumnDef } from '@tanstack/react-table'
import { Task, TaskStatus } from '../types';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon, ArrowUp, ArrowUpDown, LaptopMinimalCheckIcon, MoreVertical } from 'lucide-react';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import TaskDate from './task-date';
import { Badge } from '@/components/ui/badge';
import { statusToPTBR } from '@/lib/utils';
import { TaskActions } from './task-actions';
import { CircularProgress } from '@/components/circular-progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CategoryColumn } from './category-column';

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='p-0 hover:bg-transparent'
          onClick={column.getToggleSortingHandler()}
        >
          Nome da Tarefa
          {
            column.getIsSorted() === "asc" && (
              <ArrowUp className="h-4 w-4" />
            )
          }
          {
            column.getIsSorted() === "desc" && (
              <ArrowUp className="h-4 w-4 transform rotate-180" />
            )
          }
          {
            !column.getIsSorted() && (
              <ArrowUpDown className="h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return <p className='line-clamp-1'>{name}</p>
    }
  },
  {
    accessorKey: 'project',
    enableHiding: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='p-0 hover:bg-transparent'
          onClick={column.getToggleSortingHandler()}
        >
          Projeto
          {
            column.getIsSorted() === "asc" && (
              <ArrowUp className="h-4 w-4" />
            )
          }
          {
            column.getIsSorted() === "desc" && (
              <ArrowUp className="h-4 w-4 transform rotate-180" />
            )
          }
          {
            !column.getIsSorted() && (
              <ArrowUpDown className="h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className='flex items-center gap-x-2 text-sm font-medium'>
          <ProjectAvatar
            className='size-6'
            name={project.name}
            image={project.imageUrl} />
          <p className='line-clamp-1'>
            {project.name}
          </p>
        </div>
      )
    }
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='p-0 hover:bg-transparent'
          onClick={column.getToggleSortingHandler()}>
          Responsável
          {
            column.getIsSorted() === "asc" && (
              <ArrowUp className="h-4 w-4" />
            )
          }
          {
            column.getIsSorted() === "desc" && (
              <ArrowUp className="h-4 w-4 transform rotate-180" />
            )
          }
          {
            !column.getIsSorted() && (
              <ArrowUpDown className="h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className='flex items-center gap-x-2 text-sm font-medium'>
          <MemberAvatar
            className='size-6'
            fallbackClassname='text-xs'
            name={assignee.name} />
          <p className='line-clamp-1'>
            {assignee.name}
          </p>
        </div>
      )
    }
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='p-0 hover:bg-transparent'
          onClick={column.getToggleSortingHandler()}>
          Data de Entrega
          {
            column.getIsSorted() === "asc" && (
              <ArrowUp className="h-4 w-4" />
            )
          }
          {
            column.getIsSorted() === "desc" && (
              <ArrowUp className="h-4 w-4 transform rotate-180" />
            )
          }
          {
            !column.getIsSorted() && (
              <ArrowUpDown className="h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return (
        <TaskDate value={dueDate} />
      )
    }
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='p-0 hover:bg-transparent'
          onClick={column.getToggleSortingHandler()}>
          Categoria
          {
            column.getIsSorted() === "asc" && (
              <ArrowUp className="h-4 w-4" />
            )
          }
          {
            column.getIsSorted() === "desc" && (
              <ArrowUp className="h-4 w-4 transform rotate-180" />
            )
          }
          {
            !column.getIsSorted() && (
              <ArrowUpDown className="h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span>
          <CategoryColumn category={row.original?.category ?? {name: '', color: ''}} />
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='p-0 hover:bg-transparent'
          onClick={column.getToggleSortingHandler()}>
          Status
          {
            column.getIsSorted() === "asc" && (
              <ArrowUp className="h-4 w-4" />
            )
          }
          {
            column.getIsSorted() === "desc" && (
              <ArrowUp className="h-4 w-4 transform rotate-180" />
            )
          }
          {
            !column.getIsSorted() && (
              <ArrowUpDown className="h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status;
      let hasSubTasks = false;

      if (row.original.subtasks && row.original.subtasks.total > 0 && row.original.status === TaskStatus.DONE && row.original.completionPercentage !== undefined && row.original.completionPercentage !== null) {
        hasSubTasks = row.original.completionPercentage < 100;
      };

      return (
        <>
          {
            hasSubTasks ? (
              <Badge variant={status}>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger className='flex items-center'>
                      <AlertTriangleIcon className='size-4 mr-1 text-black' />
                      {statusToPTBR(status)}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Esta tarefa possui subtarefas pendentes.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Badge>
            ) : (
              <Badge variant={status} className='truncate'>
                {statusToPTBR(status)}
              </Badge>
            )
          }
        </>
      )
    }
  },
  {
    accessorKey: 'completionPercentage',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='p-0 hover:bg-transparent'
          onClick={column.getToggleSortingHandler()}>
          Progresso
          {
            column.getIsSorted() === "asc" && (
              <ArrowUp className="h-4 w-4" />
            )
          }
          {
            column.getIsSorted() === "desc" && (
              <ArrowUp className="h-4 w-4 transform rotate-180" />
            )
          }
          {
            !column.getIsSorted() && (
              <ArrowUpDown className="h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      let completionPercentage = 0;
      let hasSubTasks = false;

      if (row.original.subtasks && row.original.subtasks.total > 0) {
        hasSubTasks = true;
      };

      if (row.original.completionPercentage) {
        completionPercentage = row.original.completionPercentage;
      };

      return (
        <div className='flex items-center gap-x-2'>
          {
            hasSubTasks && (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger className='flex items-center'>
                    <LaptopMinimalCheckIcon className='size-5 mr-1 text-black' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Esta tarefa possui subtarefas.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          }
          <CircularProgress percentage={completionPercentage} />
        </div>
      )
    },
  },
  {
    accessorKey: 'actions',
    header: () => {
      return (
        <div className='flex justify-end'>
          Ações
        </div>
      )
    },
    cell: ({ row }) => {
      const id = row.original.$id;
      const projectId = row.original.projectId;

      return (
        <TaskActions
          id={id}
          projectId={projectId}
        >
          <Button variant='ghost' className='size-8 p-0'>
            <MoreVertical className='size-4' />
          </Button>
        </TaskActions>
      )
    }
  },
]
