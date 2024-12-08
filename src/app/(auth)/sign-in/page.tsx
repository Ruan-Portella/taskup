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
import { SignInInfer, SignInSchema } from './schemas'
import CardWrapper from '@/components/auth/card-wrapper'

export default function SignIn() {
  const form = useForm<SignInInfer>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: SignInInfer) => {
    console.log(data);
  };

  return (
    <CardWrapper
      title='Bem vindo de volta!'
      terms={false}
      social={true}
      href='/sign-up'
      hrefLabel='Não tem uma conta?'
      hrefName='Criar conta'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
            Entrar
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
