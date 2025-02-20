import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteTask } from "../api/use-delete-task";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
  isSubTask?: boolean;
  parentTaskId?: string;
  assigneeId?: string;
};

export const TaskActions = ({ id, projectId, children, isSubTask, parentTaskId, assigneeId }: TaskActionsProps) => {
  const workspaceId = useWorkspacesId();
  const router = useRouter();
  const pathname = usePathname();

  const { open, openSubTask } = useEditTaskModal();

  const [ConfirmDialog, confirm] = useConfirm('Deletar Tarefa', 'Essa ação é irreversível.', 'destructive');
  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  }

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  }

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {
            !isSubTask && (
              <DropdownMenuItem onClick={onOpenTask}
                className="font-medium p-[10px]">
                <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                Detalhes da Tarefa
              </DropdownMenuItem>
            )
          }
          {
            pathname.includes('tasks') && !isSubTask && (
              <DropdownMenuItem onClick={onOpenProject}
                className="font-medium p-[10px]">
                <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                Abrir Projeto
              </DropdownMenuItem>
            )
          }
          <DropdownMenuItem onClick={() => {
            if (isSubTask && parentTaskId && assigneeId) {
              openSubTask({ projectTaskId: projectId, task: { id, assigneeId, parentTaskId } });
            } else if (pathname.includes('tasks') ) {
              openSubTask({task: { id, assigneeId: '-taskup' }});
            } else {
              open(id);
            }
          }}
            className="font-medium p-[10px]">
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Editar Tarefa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} disabled={isPending} className="text-amber-700 focus:text-amber-700 font-medium p-[10px]">
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Deletar Tarefa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
};