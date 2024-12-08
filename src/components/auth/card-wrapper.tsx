import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import Link from 'next/link'


interface CardWrapperProps {
  title: string;
  terms: boolean;
  children: React.ReactNode;
  social: boolean;
  href: string;
  hrefLabel: string;
  hrefName: string;
};

export default function CardWrapper({
  title,
  terms,
  children,
  social,
  href,
  hrefLabel,
  hrefName
}: CardWrapperProps) {
  return (
    <Card className='w-full md:w-[487px] border shadow-lg'>
      <CardHeader className='flex items-center justify-center text-center p-7'>
        <CardTitle className='text-2xl'>
          {title}
        </CardTitle>
        {
          terms && (
            <CardDescription>
              Criando uma conta você está aceitando nossas {' '}
              <Link href='/privacy'>
                <span className='text-blue-700'>
                  Política de Privacidade
                </span>
              </Link>{' '}
              e {' '}
              <Link href='/terms'>
                <span className='text-blue-700'>
                  Termos de Serviço
                </span>
              </Link>{' '}
            </CardDescription>
          )
        }
      </CardHeader>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      <CardContent className='p-7'>
        {children}
      </CardContent>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      {
        social && (
          <CardContent className='p-7 pb-0 flex gap-x-4'>
            <Button disabled={false} variant='secondary' size='lg' className='w-1/2'>
              <FcGoogle className='mr-2' />
              Entrar com Google
            </Button>
            <Button disabled={false} variant='secondary' size='lg' className='w-1/2'>
              <FaGithub className='mr-2' />
              Entrar com Github
            </Button>
          </CardContent>
        )
      }
      <CardContent className='p-7 flex items-center justify-center'>
        <p>
          {hrefLabel}
          <Link href={href}>
            <span className='text-blue-700 ml-1'>
              {hrefName}
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
