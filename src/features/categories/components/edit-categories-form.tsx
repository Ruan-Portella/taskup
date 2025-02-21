'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Category } from "../types";
import { useUpdateCategory } from "../api/use-update-category";
import { Input } from "@/components/ui/input";
import { createCategorySchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/color-picker";

interface EditCategoriesFormProps {
  onCancel?: () => void;
  category: Category;
};

export const EditCategoriesForm = ({ category, onCancel }: EditCategoriesFormProps) => {
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema.omit({ workspaceId: true })),
    defaultValues: {
      name: category.name,
      color: category.color,
    }
  })

  const onSubmit = (values: z.infer<typeof createCategorySchema>) => {
    updateCategory({ json: { ...values }, param: { categoryId: category.$id } }, {
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
          Editar Categoria
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
                        placeholder="Nome da Categoria"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="color">
                      Cor
                    </FormLabel>
                    <FormControl>
                      <ColorPicker
                        {...field}
                        id="color"
                        name="color"
                        className="w-full h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-9" />
            <div className="flex items-center justify-between">
              <Button disabled={isPending} type="button" size='lg' variant='secondary' onClick={onCancel} className={cn('p-4', !onCancel && 'hidden')}>
                Cancelar
              </Button>
              <Button disabled={isPending} type="submit" className="ml-auto p-4" size='lg'>
                Editar Categoria
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};