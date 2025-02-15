'use client';

import {useQueryState, parseAsBoolean, parseAsString} from 'nuqs'
import { TaskStatus } from '../types';

export function useCreateTaskModal() {
  const [isOpen, setIsOpen] = useQueryState('create-task', parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true}))
  const [status, setStatus] = useQueryState('create-task-status', parseAsString.withOptions({clearOnDefault: true}))

  return {
    isOpen,
    status,
    open: (status?: TaskStatus) => {
      setIsOpen(true)
      if (status) {
        setStatus(status)
      }
    },
    close: () => {
      setIsOpen(false)
      setStatus(null)
    },
    setIsOpen: (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        setStatus(null)
      }
    },
  }
}