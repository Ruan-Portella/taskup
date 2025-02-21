import { Card, CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import React from 'react'
import { EditCategoriesForm } from './edit-categories-form';
import { useGetCategory } from '../api/use-get-category';


export default function EditCategoryFormWrapper({categoryId, onCancel}:{categoryId: string, onCancel: () => void}) {
  const { data, isLoading } = useGetCategory({ categoryId });

  if (isLoading) {
    return (
      <Card className='w-full h-[714px] border-none shadow-none'>
        <CardContent className='flex items-center justify-center h-full'>
          <Loader className='fize-5 animate-spin text-muted-foreground' />
        </CardContent>
      </Card>
    )
  };

  if (!data) {
    return null;
  }

  return (
    <EditCategoriesForm category={data} onCancel={onCancel} />
  );
};
