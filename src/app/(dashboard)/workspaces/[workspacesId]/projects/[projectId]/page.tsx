import { Button } from "@/components/ui/button"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"
import { getProject } from "@/features/projects/queries"
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher"
import { Pencil } from "lucide-react"
import Link from "next/link"

interface ProjectIdPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectIdPage({
  params
}: ProjectIdPageProps) {
  const { projectId } = await params
  const initialValues = await getProject({
    projectId: projectId
  })

  if (!initialValues) {
    throw new Error('Projeto não encontrado')
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-6"
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant='secondary' size='sm' asChild>
            <Link href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}>
              <Pencil className="size-4" />
              Editar Projeto
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  )
}