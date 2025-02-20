'use client';

import {useQueryState, parseAsBoolean, parseAsString, parseAsJson} from 'nuqs'
import { TaskStatus } from '../types';
import { querySchema } from '../schemas';


export function useCreateTaskModal() {
  const [isOpen, setIsOpen] = useQueryState('create-task', parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true}))
  const [status, setStatus] = useQueryState('create-task-status', parseAsString.withOptions({clearOnDefault: true}))
  const [projectId, setProjectId] = useQueryState('create-task-project-id', parseAsString.withOptions({clearOnDefault: true}))
  const [task, setTask] = useQueryState('task', parseAsJson(querySchema.parse).withOptions({clearOnDefault: true}))

  return {
    isOpen,
    status,
    task,
    projectId,
    open: (status?: TaskStatus) => {
      setIsOpen(true)
      if (status) {
        setStatus(status)
      }
      if (task) {
        setTask(null)
      }
      if (projectId) {
        setProjectId(null)
      }
    },
    openProjectId: (projectId: string) => {
      setIsOpen(true)
      setProjectId(projectId)
    },
    openSubTask: ({projectTaskId, task}: {projectTaskId?: string, task: ReturnType<typeof querySchema.parse> }) => {
      setIsOpen(true)
      if (projectTaskId) {
        setProjectId(projectTaskId)
      }
      setTask(task)
    },
    close: () => {
      setIsOpen(false)
      setStatus(null)
      if (task) {
        setTask(null)
      }

      if (projectId) {
        setProjectId(null)
      }
    },
    setIsOpen: (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        setStatus(null)
      }
      if (task) {
        setTask(null)
      }
      if (projectId) {
        setProjectId(null)
      }
    },
  }
}