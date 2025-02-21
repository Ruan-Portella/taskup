'use client';

import { DataTable } from '@/components/data-table';
import { DottedSeparator } from '@/components/dotted-separator';
import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { columns } from '@/features/categories/components/columns';
import { useCreateCategoryModal } from '@/features/categories/hooks/use-create-category.modal';
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';
import { PlusIcon } from 'lucide-react';
import React from 'react'

export default function CategoriesPage() {
  const workspaceId = useWorkspacesId();

  const { open } = useCreateCategoryModal();
  const { data, isLoading } = useGetCategories({ workspaceId });

  if (isLoading) {
    return <PageLoader />
  };

  if (!data) {
    return <PageError message='Erro ao carregar categorias' />
  }

  return (
    <div className='flex-1 w-full border rounded-lg p-4'>
      <div className='flex items-center justify-end mb-4'>
        <Button onClick={open} size='sm' className='w-full lg:w-auto ml-auto justify-self-end'><PlusIcon className='size-4' />Adicionar Categoria</Button>
      </div>
      <DottedSeparator className='my-4' />
      <DataTable data={data?.documents} columns={columns} />
    </div>
  )
}
