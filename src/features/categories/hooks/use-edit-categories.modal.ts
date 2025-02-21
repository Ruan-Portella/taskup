'use client';

import {useQueryState, parseAsString} from 'nuqs'

export function useEditCategoriesModal() {
  const [categoryId, setCategoryId] = useQueryState('edit-categories', parseAsString);

  const open = (ìd: string) => setCategoryId(ìd);
  const close = () => setCategoryId(null);

  return {
    categoryId,
    open,
    close,
  }
}