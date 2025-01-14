'use client';

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateWorkspaceSchema } from "../schemas/update";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateWorkspace } from "../api/use-update-workspaces";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types/workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspaces } from "../api/use-delete-workspace";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface EditWorkspacesFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
};

export const EditWorkspacesForm = ({ onCancel, initialValues }: EditWorkspacesFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspaces();
  const { mutate: resetInviteCode, isPending: isResetingInviteCode } = useResetInviteCode();
  const [DeleteDialog, confirmDelete] = useConfirm('Você tem certeza que deseja excluir esta Área de Trabalho?', 'Essa ação é irreversível.', 'destructive');
  const [ResetDialog, confirmReset] = useConfirm('Você tem certeza que deseja resetar o link de convite?', 'Isso irá gerar um novo link de convite para a Área de Trabalho.', 'destructive');

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
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

    deleteWorkspace({
      param: { workspaceId: initialValues.$id }
    }, {
      onSuccess: () => {
        window.location.href = '/';
      }
    })
  }

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();

    if (!ok) {
      return;
    }

    resetInviteCode({
      param: { workspaceId: initialValues.$id }
    }, {
      onSuccess: () => {
        router.refresh();
      }
    })
  }

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    mutate({
      form: finalValues,
      param: { workspaceId: initialValues.$id }
    }, {
      onSuccess: ({ data }) => {
        form.reset();
        router.push(`/workspaces/${data.$id}`);
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink)
    .then(() => {
      toast.success('Link copiado com sucesso!');
    })
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button size='sm' variant='secondary' onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
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
                          placeholder="Nome da Área de Trabalho"
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
                              field.value instanceof File ? URL.createObjectURL(field.value) : field.value} alt="Imagem da Área de Trabalho" />
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
                            Ícone da Área de Trabalho
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
                <Button disabled={isPending} className="ml-auto  p-4" type="submit" size='lg' onClick={onCancel}>
                  Editar Área de Trabalho
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
              Convidar Membros
            </h3>
            <p className="text-sm text-muted-foreground">
              Compartilhe este link para convidar membros para a Área de Trabalho.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button className="size-12" variant='secondary' onClick={handleCopyInviteLink}>
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button size='sm' variant='destructive' className="mt-6 w-fit ml-auto" type="button" disabled={isPending || isResetingInviteCode} onClick={handleResetInviteCode}>
              Resetar Link de Convite
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none" >
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">
              Zona de Perigo
            </h3>
            <p className="text-sm text-muted-foreground">
              Aqui você pode excluir a Área de Trabalho. Esta ação é irreversível.
            </p>
            <DottedSeparator className="py-7" />
            <Button size='sm' variant='destructive' className="mt-6 w-fit ml-auto" type="button" disabled={isPending || isDeletingWorkspace} onClick={handleDelete}>
              Excluir Área de Trabalho
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};