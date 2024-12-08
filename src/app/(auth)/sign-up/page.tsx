'use client';

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpInfer, SignUpSchema } from './schemas'
import CardWrapper from '@/components/auth/card-wrapper'

export default function SignUp() {
  const form = useForm<SignUpInfer>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: SignUpInfer) => {
    console.log(data);
  };

  return (
    <CardWrapper
      title='Crie sua conta'
      terms
      social={false}
      href='/sign-in'
      hrefLabel='Já tem uma conta?'
      hrefName='Entrar'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            name='name'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='name'>Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='text'
                    placeholder='Ruan Portella'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='email'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    placeholder='ruanportelladev@gmail.com'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='password'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='password'>Senha</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='******'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={false} size='lg' className='w-full'>
            Criar conta
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
