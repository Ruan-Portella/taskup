'use client';

import {useQueryState, parseAsString, parseAsJson} from 'nuqs'
import { querySchema } from '../schemas';

export function useEditTaskModal() {
  const [taskId, setTaskId] = useQueryState('edit-task', parseAsString);
  const [projectId, setProjectId] = useQueryState('edit-task-project-id', parseAsString.withOptions({clearOnDefault: true}))
  const [task, setTask] = useQueryState('task', parseAsJson(querySchema.parse).withOptions({clearOnDefault: true}))

  const open = (id: string) => setTaskId(id);
  const close = () => {
    setTaskId(null)
    if (task) {
      setTask(null)
    }
    if (projectId) {
      setProjectId(null)
    }
  };

  return {
    task,
    taskId,
    projectId,
    open,
    openSubTask: ({projectTaskId, task}: {projectTaskId: string, task: ReturnType<typeof querySchema.parse> }) => {
      setTaskId(task.id)
      setProjectId(projectTaskId)
      setTask(task)
    },
    close,
    setTaskId
  }
}