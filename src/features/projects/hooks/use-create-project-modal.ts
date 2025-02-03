'use client';

import {useQueryState, parseAsBoolean} from 'nuqs'

export function useCreateProjectModal() {
  const [isOpen, setIsOpen] = useQueryState('create-project', parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true}))

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    setIsOpen
  }
}