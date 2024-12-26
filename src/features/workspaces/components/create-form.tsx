'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createWorkspaceSchema } from "../schemas/create";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreate } from "../api/use-create";

interface CreateFormProps {
  onCancel?: () => void;
};

export const CreateForm = ({ onCancel }: CreateFormProps) => {
  const {mutate, isPending} = useCreate();

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
    }
  })

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    mutate(values);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Criar nova Area de Trabalho
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7" >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nome da Area de Trabalho"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-9" />
            <div className="flex items-center justify-between">
              <Button disabled={isPending} type="button" size='lg' variant='secondary' onClick={onCancel}>
                Cancelar
              </Button>
              <Button disabled={isPending} type="submit" size='lg' onClick={onCancel}>
                Criar Area de Trabalho
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};