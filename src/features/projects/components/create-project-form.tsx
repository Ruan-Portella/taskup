'use client';

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createProjectSchema } from "../schemas/create";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateProjects } from "../api/use-create-projects";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";

interface CreateProjectFormProps {
  onCancel?: () => void;
};

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const workspaceId = useWorkspacesId();
  // const router = useRouter();
  const { mutate, isPending } = useCreateProjects();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({workspaceId: true})),
    defaultValues: {
      name: '',
      image: '',
    }
  })

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
      workspaceId
    };

    mutate(finalValues, {
      onSuccess: () => {
        form.reset();
        // router.push(`/workspaces/${data.$id}`);
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Criar novo projeto
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
                    <FormLabel htmlFor="name">
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="name"
                        autoComplete='name'
                        placeholder="Nome do Projeto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image fill className="object-cover" src={
                            field.value instanceof File ? URL.createObjectURL(field.value) : field.value} alt="Imagem do Projeto" />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">
                          Ícone do Projeto
                        </p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG ou JPEG. Max 1MB
                        </p>
                        <input
                          onChange={handleImageChange}
                          type="file"
                          ref={inputRef}
                          disabled={isPending}
                          className="hidden"
                          accept=".jpg, .png, .jpeg, .svg"
                        />
                        {
                          field.value ? (
                            <Button disabled={isPending} type='button' size='xs' variant='destructive' className="w-fit mt-2" onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = '';
                              }
                            }}>
                              Remover Imagem
                            </Button>
                          ) : (
                            <Button disabled={isPending} type='button' size='xs' variant='teritary' className="w-fit mt-2" onClick={() => inputRef.current?.click()}>
                              Adicionar Imagem
                            </Button>
                          )
                        }
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeparator className="py-9" />
            <div className="flex items-center justify-between">
              <Button disabled={isPending} type="button" size='lg' variant='secondary' onClick={onCancel} className={cn('p-4', !onCancel && 'hidden')}>
                Cancelar
              </Button>
              <Button disabled={isPending} type="submit" className="ml-auto p-4" size='lg' onClick={onCancel}>
                Criar Projeto
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};