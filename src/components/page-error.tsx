import { AlertTriangleIcon } from 'lucide-react';
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';

interface PageErrorProps {
  message: string;
  hrefBack?: string;
}

export default function PageError({ message = 'Algo deu errado.', hrefBack }: PageErrorProps) {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <AlertTriangleIcon className='size-6 text-muted-foreground mb-2' />
      <p className='text-sm font-medium text-muted-foreground'>{message}</p>
      {
        hrefBack && (
          <Button size='sm' variant='secondary' className='mt-2' asChild>
            <Link href={hrefBack}>
              Voltar
            </Link>
          </Button>
        )
      }
    </div>
  )
}
