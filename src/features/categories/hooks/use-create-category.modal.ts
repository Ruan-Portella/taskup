'use client';

import {useQueryState, parseAsBoolean} from 'nuqs'

export function useCreateCategoryModal() {
  const [isOpen, setIsOpen] = useQueryState('create-categories', parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true}));

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
  }
}