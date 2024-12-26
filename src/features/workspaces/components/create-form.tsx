'use client';

import { useRef } from "react";
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
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";

interface CreateFormProps {
  onCancel?: () => void;
};

export const CreateForm = ({ onCancel }: CreateFormProps) => {
  const { mutate, isPending } = useCreate();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      image: '',
    }
  })

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(finalValues, {
      onSuccess: () => {
        form.reset();
        // REDIRECIONAR PARA A PÁGINA DA ÁREA DE TRABALHO
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
          Criar nova Área de Trabalho
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
                          Adicione uma imagem para a Área de Trabalho
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
                        <Button disabled={isPending} type='button' size='xs' variant='teritary' className="w-fit mt-2" onClick={() => inputRef.current?.click()}>
                          Adicionar Imagem
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeparator className="py-9" />
            <div className="flex items-center justify-between">
              <Button disabled={isPending} type="button" size='lg' variant='secondary' onClick={onCancel}>
                Cancelar
              </Button>
              <Button disabled={isPending} type="submit" size='lg' onClick={onCancel}>
                Criar Área de Trabalho
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};