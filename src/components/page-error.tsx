import { AlertTriangleIcon } from 'lucide-react';
import React from 'react'

interface PageErrorProps {
  message: string;
}

export default function PageError({message = 'Algo deu errado.'}: PageErrorProps) {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <AlertTriangleIcon className='size-6 text-muted-foreground mb-2' />
      <p className='text-sm font-medium text-muted-foreground'>{message}</p>
    </div>
  )
}
