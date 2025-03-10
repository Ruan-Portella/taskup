'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTaskSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DatePicker from "@/components/date-picker";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Task, TaskStatus } from "../types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "../api/use-update-task";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { SelectCreatable } from '@/components/creatable-select';

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string, name: string, imageUrl: string }[];
  memberOptions: { id: string, name: string }[];
  initialValues: Task;
  projectId?: string;
  assigneeId?: string;
  parentTaskId?: string;
  disableAssignee?: boolean;
};

export const EditTaskForm = ({ onCancel, projectOptions, memberOptions, initialValues, projectId, assigneeId, parentTaskId, disableAssignee }: EditTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask();

  const workspaceId = useWorkspacesId();

  const categoryQuery = useGetCategories({ workspaceId });
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ json: { name, workspaceId } });
  const categoryOptions = Array.isArray(categoryQuery?.data?.documents) && categoryQuery.data?.documents?.map((category: { name: string, $id: string }) => ({
    label: category.name,
    value: category.$id
  })) || [];

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true, description: true })),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined,
      projectId: projectId || initialValues.projectId,
      assigneeId: assigneeId || initialValues.assigneeId,
      parentTaskId: parentTaskId ? parentTaskId : undefined
    }
  })

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate({ json: { ...values, parentTaskId }, param: { taskId: initialValues.$id } }, {
      onSuccess: () => {
        form.reset();
        onCancel?.();
      }
    });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Editar Tarefa
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
                        placeholder="Nome da Tarefa"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="dueDate">
                      Data de Entrega
                    </FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {
                (!assigneeId && !disableAssignee) && (
                  <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="assigneeId">
                          Responsável
                        </FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um responsável" />
                            </SelectTrigger>
                          </FormControl>
                          <FormMessage />
                          <SelectContent>
                            {memberOptions.map(member => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center gap-x-2">
                                  <MemberAvatar
                                    name={member.name}
                                    className="size-6"
                                  />
                                  <span>{member.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="status">
                      Status
                    </FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>
                          Pendente
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>
                          A Fazer
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          Em Progresso
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          Em Revisão
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>
                          Concluído
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {
                (!assigneeId && !disableAssignee) && (
                  <FormField name='categoryId' control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='categoryId'>Categoria</FormLabel>
                      <FormControl>
                        <SelectCreatable placeholder='Selecione uma categoria' options={categoryOptions} onCreate={onCreateCategory} value={field.value} onChange={field.onChange} disabled={categoryMutation.isPending} />
                      </FormControl>
                    </FormItem>
                  )} />
                )
              }
              {
                !projectId && (
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="projectId">
                          Projeto
                        </FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um projeto" />
                            </SelectTrigger>
                          </FormControl>
                          <FormMessage />
                          <SelectContent>
                            {projectOptions.map(project => (
                              <SelectItem key={project.id} value={project.id}>
                                <div className="flex items-center gap-x-2">
                                  <ProjectAvatar
                                    name={project.name}
                                    className="size-6"
                                    image={project.imageUrl}
                                  />
                                  <span>{project.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }
            </div>
            <DottedSeparator className="py-9" />
            <div className="flex items-center justify-between">
              <Button disabled={isPending} type="button" size='lg' variant='secondary' onClick={onCancel} className={cn('p-4', !onCancel && 'hidden')}>
                Cancelar
              </Button>
              <Button disabled={isPending} type="submit" className="ml-auto p-4" size='lg'>
                Editar Tarefa
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};