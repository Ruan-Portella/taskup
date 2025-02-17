'use client';

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateProjectSchema } from "../schemas/update";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateProjects } from "../api/use-update-project";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Project } from "../types/project";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteProject } from "../api/use-delete-project";
interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
};

export const EditProjectForm = ({ onCancel, initialValues }: EditProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProjects();
  const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm('Você tem certeza que deseja excluir este Projeto?', 'Essa ação é irreversível.', 'destructive');


  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl || "",
    }
  })

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) {
      return;
    }

    deleteProject({
      param: { projectId: initialValues.$id }
    }, {
      onSuccess: () => {
        window.location.href = `/workspaces/${initialValues.workspaceId}`;
      }
    })
  }

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    mutate({
      form: finalValues,
      param: { projectId: initialValues.$id }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button size='sm' variant='secondary' onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}>
            <ArrowLeftIcon className="size-4" />
            Voltar
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
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
                <Button disabled={isPending || isDeletingProject} className="ml-auto  p-4" type="submit" size='lg' onClick={onCancel}>
                  Editar Projeto
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none" >
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">
              Zona de Perigo
            </h3>
            <p className="text-sm text-muted-foreground">
              Aqui você pode excluir a Projeto. Esta ação é irreversível.
            </p>
            <DottedSeparator className="py-7" />
            <Button size='sm' variant='destructive' className="mt-6 w-fit ml-auto" type="button" disabled={isPending || isDeletingProject} onClick={handleDelete}>
              Excluir Projeto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};