'use client';

import {useQueryState, parseAsBoolean} from 'nuqs'

export function useConfettiStore() {
  const [isOpen, setIsOpen] = useQueryState('completed-task', parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true}))

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
  }
}