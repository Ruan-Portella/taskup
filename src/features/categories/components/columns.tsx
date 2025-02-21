'use client';
import { ColumnDef } from '@tanstack/react-table'
import { Category } from '../types';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowUpDown, MoreVertical } from 'lucide-react';
import { CategoryActions } from './category-actions';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='p-0 hover:bg-transparent'
          onClick={column.getToggleSortingHandler()}
        >
          Nome da Categoria
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

      return (
        <CategoryActions
          id={id}
        >
          <Button variant='ghost' className='size-8 p-0'>
            <MoreVertical className='size-4' />
          </Button>
        </CategoryActions>
      )
    }
  },
]
