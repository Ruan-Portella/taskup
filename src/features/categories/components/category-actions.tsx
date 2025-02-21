import { DropdownMenu, DropdownMenuContentModal, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteCategory } from "../api/use-delete-category";
import { useEditCategoriesModal } from "../hooks/use-edit-categories.modal";

interface CategoryActionsProps {
  id: string;
  children: React.ReactNode;
};

export const CategoryActions = ({ id, children }: CategoryActionsProps) => {
  const [ConfirmDialog, confirm] = useConfirm('Deletar Categoria', 'Essa ação é irreversível.', 'destructive');
  const { mutate: deleteCategory, isPending } = useDeleteCategory();
  const {open} = useEditCategoriesModal();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteCategory({ param: { categoryId: id } });
  }


  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContentModal align="end" className="w-48 bg-white hover:bg-white cursor-pointer">
          <DropdownMenuItem onClick={() => open(id)} disabled={isPending} className="font-medium p-[10px]">
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Editar Tarefa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} disabled={isPending} className="text-amber-700 focus:text-amber-700 font-medium p-[10px]">
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Deletar Tarefa
          </DropdownMenuItem>
        </DropdownMenuContentModal>
      </DropdownMenu>
    </div>
  )
};