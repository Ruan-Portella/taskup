'use client';

import {useQueryState, parseAsBoolean} from 'nuqs'

export function useCreateTaskModal() {
  const [isOpen, setIsOpen] = useQueryState('create-task', parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true}))

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    setIsOpen
  }
}